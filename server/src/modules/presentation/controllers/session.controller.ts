import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { RequestHandler } from '../../../hapi-utils';
import { SessionModel, ClientSessionResults } from '../models';
import { sessionRepository, clientIdentifiersRepository } from '../data-access';
import { SessionWebModel } from './web-models/session';
import { presentationNotifier } from '../services/notifications';
import featureService from '../services/features';
import { userAgentService } from '../services/browser-info';
import { validation } from '../validators';
import { SessionState } from '../../../common';

const mapSession = (session: SessionModel) => ({
    id: session.id,
    name: session.name,
    createdAt: session.createdAt,
    state: session.state,
    currentSlideFeatureId: session.currentSlideFeatureId
} as SessionWebModel);

function create(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const name = request.payload.name;
    const session = {
        name: name,
        state: SessionState.Welcome,
        createdAt: new Date(),
        currentSlideFeatureId: '',
        browserInfo: [],
        clientIdentifiers: [],
        clientResults: []
    } as SessionModel;

    return sessionRepository.create(session)
        .then(() => reply().code(200));
}

function get(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    return sessionRepository.get()
        .then(sessions => reply(sessions.map(item => mapSession(item))));
}

function getById(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const sessionId = request.params.id;
    return sessionRepository.getById(sessionId)
        .then(session => {
            if (!session) {
                return reply(Boom.notFound(`Session at id: "${sessionId}", doesn't exist`));
            }
            return reply(mapSession(session));
        });
}

async function setState(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const sessionId = request.params.id;
    const newState = request.payload.state as SessionState;

    const validationResult = await validation.sessionExists(sessionId);

    if (validationResult.isSuccess) {
        const sessionUpdates = {
            state: newState
        } as {[key in keyof SessionModel]: any };

        if (newState === SessionState.Feature) {
            sessionUpdates.currentSlideFeatureId = featureService.getFirstFeature().id;
        }

        return sessionRepository.updateFields(sessionId, sessionUpdates)
            .then(() => {
                presentationNotifier.setState(newState, sessionUpdates);
                return reply().code(200);
            });
    } else {
        return reply(Boom.notFound(validationResult.errorsMessage));
    }
}

function setSlideFeature(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const { slideFeatureId } = request.payload;
    const sessionId = request.params.id;

    return sessionRepository.getById(sessionId)
        .then(session => {
            if (!session) {
                return reply(Boom.badRequest(`Session at id: "${sessionId}", doesn't exist`));
            }
            if (session.state !== SessionState.Feature) {
                return reply(Boom.badRequest(`Session ${session.name} should be in presentation state!`));
            }


            return sessionRepository.updateFields(sessionId, {
                currentSlideFeatureId: slideFeatureId
            } as { [key in keyof SessionModel]: any })
                .then(() => {
                    presentationNotifier.setSlideFeature(slideFeatureId, session);
                    return reply();
                });
        });
}

function addResults(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const clientSessionResults = request.payload as ClientSessionResults[];
    const sessionId = request.params.id;
    const clientId = request.state['client-id'];
    const clientSystemInfo = userAgentService.mapUserAgent(request.headers['user-agent']);

    return sessionRepository.exists(sessionId)
        .then(sessionExists => {
            if (!sessionExists) {
                return reply(Boom.badRequest(`Session at id: "${sessionId}", doesn't exist`));
            }

            clientIdentifiersRepository.existInSessionResults(clientId, sessionId)
                .then(exists => {
                    if (exists) {
                        return reply();
                    }

                    return sessionRepository.addClientResult(
                        sessionId,
                        {
                            ...clientSystemInfo,
                            clientIdentifier: clientId,
                            clientResults: clientSessionResults
                        })
                        .then(() => reply());
                });
        });
}

export default {
    create: <RequestHandler>create,
    get: <RequestHandler>get,
    getById: <RequestHandler>getById,
    setState: <RequestHandler>setState,
    setSlideFeature: <RequestHandler>setSlideFeature,
    addResults: <RequestHandler>addResults
};
