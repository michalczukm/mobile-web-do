import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { RequestHandler } from '../../../hapi-utils';
import { SessionModel, ClientSessionResults, CreateSessionModel } from '../models';
import { sessionRepository, clientIdentifiersRepository } from '../data-access';
import { SessionWebModel } from './web-models/session';
import { presentationNotifier } from '../services/notifications';
import featureService from '../services/features';
import { userAgentService } from '../services/browser-info';
import { validation } from '../validators';
import { SessionState } from '../../../common';
import { environmentConfig } from '../../../infrastructure';

const mapSession = (session: SessionModel) => ({
    id: session.id,
    name: session.name,
    createdAt: session.createdAt,
    state: session.state,
    currentSlideFeatureId: session.currentSlideFeatureId,
    sessionUrl: `${environmentConfig.presentation.hostUrl}?sessionId=${session.id}`
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
    } as CreateSessionModel;

    return sessionRepository.create(session)
        .then(sessionModel => reply(mapSession(sessionModel)).code(200));
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
        } as { [key in keyof SessionModel]: any };

        if (newState === SessionState.Feature) {
            sessionUpdates.currentSlideFeatureId = featureService.getFirstFeature().id;
        }

        await sessionRepository.updateFields(sessionId, sessionUpdates);
        const session = await sessionRepository.getById(sessionId);

        if (!session) {
            return reply(Boom.notFound(validationResult.errorsMessage));
        }

        presentationNotifier.setState(newState, session);
        return reply().code(200);
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

async function addResults(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const clientSessionResults = request.payload as ClientSessionResults[];
    const sessionId = request.params.id;
    const clientId = request.state['client-id'];
    const clientSystemInfo = userAgentService.mapUserAgent(request.headers['user-agent']);

    const sessionExists = await sessionRepository.exists(sessionId);
    if (!sessionExists) {
        return reply(Boom.badRequest(`Session at id: "${sessionId}", doesn't exist`));
    }

    const exists = await clientIdentifiersRepository.existInSessionResults(clientId, sessionId);
    if (exists) {
        return reply();
    }

    await sessionRepository.addClientResult(
        sessionId,
        {
            ...clientSystemInfo,
            clientIdentifier: clientId,
            clientResults: clientSessionResults
        });

    return reply();
}

export default {
    create: <RequestHandler>create,
    get: <RequestHandler>get,
    getById: <RequestHandler>getById,
    setState: <RequestHandler>setState,
    setSlideFeature: <RequestHandler>setSlideFeature,
    addResults: <RequestHandler>addResults
};
