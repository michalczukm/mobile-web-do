import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as fs from 'fs';
import * as Path from 'path';

import { RequestHandler } from '../../../hapi-utils';
import { Session, ClientSessionResults } from '../models';
import { sessionRepository, clientIdentifiersRepository } from '../data-access';
import { SessionWebModel } from './web-models/session';
import { presentationNotifier } from '../services/notifications';
import featureService from '../services/features';
import { userAgentService } from '../services/browser-info';
import { SessionState, logger } from '../../../common';
import { DATA } from '../../data';

const mapSession = (session: Session) => ({
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
        clientIdentifiers: []
    } as Session;

    return sessionRepository.create(session)
        .then(contains => reply().code(200));
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

function setState(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const sessionId = request.params.id;
    const newState = request.payload.state as SessionState;

    return sessionRepository.getById(sessionId)
        .then(session => {
            if (!session) {
                return reply(Boom.badRequest(`Session at id: "${sessionId}", doesn't exist`));
            }

            session.state = newState;

            if (newState === SessionState.Feature) {
                session.currentSlideFeatureId = featureService.getPresentationSet()[0].id;
            }

            return sessionRepository.update(session)
                .then(() => {
                    presentationNotifier.setState(newState, session);
                    return reply().code(200);
                });
        });
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

            session.currentSlideFeatureId = slideFeatureId;

            return sessionRepository.update(session)
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

    return sessionRepository.getById(sessionId)
        .then(session => {
            if (!session) {
                return reply(Boom.badRequest(`Session at id: "${sessionId}", doesn't exist`));
            }

            clientIdentifiersRepository.existInSessionResults(clientId, sessionId)
                .then(exists => {
                    if (exists) {
                        return reply();
                    }

                    session.clientResults.push(({
                        ...clientSystemInfo,
                        clientIdentifier: clientId,
                        clientResults: clientSessionResults
                    }));

                    return sessionRepository.update(session)
                        .then(() => reply());
                });
        });
}

function persist(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const sessionId = request.params.id;

    const date = new Date();
    const dataToSave = JSON.stringify(DATA);

    const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}`;

    return new Promise((resolve, reject) => {
        fs.writeFile(Path.join(__dirname, `session-${sessionId}_${dateString}.db`), dataToSave, { encoding: 'utf8' }, (error) => {
            if (error) {
                logger.error('Cannot persist session data', error);
                resolve(reply(Boom.internal('Cannot persist session data')));
            } else {
                resolve(reply().code(200));
            }
        });
    });
}

export default {
    create: <RequestHandler>create,
    get: <RequestHandler>get,
    getById: <RequestHandler>getById,
    setState: <RequestHandler>setState,
    setSlideFeature: <RequestHandler>setSlideFeature,
    addResults: <RequestHandler>addResults,
    persist: <RequestHandler>persist
};
