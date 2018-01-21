import * as Hapi from 'hapi';
import * as uuid from 'uuid/v4';
import { RequestHandler } from '../../../hapi-utils';
import { Session, SessionState } from '../models';
import sessionRepository from '../session.repository';
import { SessionWebModel } from './web-models/session';
import { presentationNotifier } from '../services/notifications';

export default {
    create: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const name = request.payload.name;
        const session = {
            id: uuid(),
            name: name,
            state: SessionState.Welcome,
            browserInfo: [],
            clientIdentifiers: []
        } as Session;

        return sessionRepository.create(session)
            .then(contains => reply().code(200))
            .catch(reason => reply(reason).code(500));

    }) as RequestHandler,

    get: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const mapSession = (session: Session) => ({
            id: session.id,
            name: session.name
        } as SessionWebModel);

        return sessionRepository.get()
            .then(sessions => reply(sessions.map(item => mapSession(item))))
            .catch(reason => reply(reason).code(500));
    }) as RequestHandler,

    setSlideFeature: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const { sessionId, slideFeatureId } = request.payload;

        return sessionRepository.getById(sessionId)
            .then(session => {
                if (session.state !== SessionState.Feature) {
                    return reply(`Session ${session.name} should be in presentation state!`).code(400);
                }

                session.currentSlideFeatureId = slideFeatureId;

                return sessionRepository.update(session)
                    .then(() => {
                        presentationNotifier.setSlide(slideFeatureId, session);
                        return reply().code(200);
                    });
            })
            .catch(reason => reply(reason).code(500));

    }) as RequestHandler
};