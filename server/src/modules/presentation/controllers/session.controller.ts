import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as uuid from 'uuid/v4';
import { RequestHandler } from '../../../hapi-utils';
import { Session, SessionState } from '../models';
import sessionRepository from '../session.repository';
import { SessionWebModel } from './web-models/session';
import { presentationNotifier } from '../services/notifications';
import featureService from '../services/features';

const mapSession = (session: Session) => ({
    id: session.id,
    name: session.name,
    createdAt: session.createdAt,
    state: session.state,
    currentSlideFeatureId: session.currentSlideFeatureId
} as SessionWebModel);

export default {
    create: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const name = request.payload.name;
        const session = {
            id: uuid(),
            name: name,
            state: SessionState.Welcome,
            createdAt: new Date(),
            currentSlideFeatureId: '',
            browserInfo: [],
            clientIdentifiers: []
        } as Session;

        return sessionRepository.create(session)
            .then(contains => reply().code(200));

    }) as RequestHandler,

    get: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        return sessionRepository.get()
            .then(sessions => reply(sessions.map(item => mapSession(item))));
    }) as RequestHandler,

    getById: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const sessionId = request.params.id;
        return sessionRepository.getById(sessionId)
            .then(session => reply(mapSession(session)));
    }) as RequestHandler,

    setState: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const sessionId = request.params.id;
        const newState: SessionState = request.payload.state;

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
    }) as RequestHandler,

    setSlideFeature: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const { sessionId, slideFeatureId } = request.payload;

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
                        return reply().code(200);
                    });
            })

    }) as RequestHandler
};
