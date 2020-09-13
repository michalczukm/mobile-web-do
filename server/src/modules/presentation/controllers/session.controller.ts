import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';

import { getPayload, RequestHandler } from '../../../hapi-utils';
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

async function create(request: Hapi.Request): Promise<Hapi.Lifecycle.ReturnValueTypes> {
    const payload: any = getPayload(request);
    const name = payload.name;
    const session = {
        name: name,
        state: SessionState.Welcome,
        createdAt: new Date(),
        currentSlideFeatureId: '',
        browserInfo: [],
        clientIdentifiers: [],
        clientResults: []
    } as CreateSessionModel;

    return mapSession(await sessionRepository.create(session));
}

async function get(request: Hapi.Request): Promise<Hapi.Lifecycle.ReturnValueTypes> {
    return (await sessionRepository.get()).map(item => mapSession(item));
}

async function getById(request: Hapi.Request): Promise<Hapi.Lifecycle.ReturnValueTypes> {
    const sessionId = request.params.id;
    const session = await sessionRepository.getById(sessionId);
    if (!session) {
        throw Boom.notFound(`Session at id: "${sessionId}", doesn't exist`);
    }
    return mapSession(session);
}

async function setState(request: Hapi.Request, responseToolkit: Hapi.ResponseToolkit): Promise<Hapi.Lifecycle.ReturnValueTypes> {
    const sessionId = request.params.id;
    const payload: any = getPayload(request);
    const newState = payload.state as SessionState;

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
            throw Boom.notFound(validationResult.errorsMessage);
        }

        presentationNotifier.setState(newState, session);
        return {};
    } else {
        throw Boom.notFound(validationResult.errorsMessage);
    }
}

async function setSlideFeature(request: Hapi.Request, responseToolkit: Hapi.ResponseToolkit): Promise<Hapi.Lifecycle.ReturnValueTypes> {
    const payload: any = getPayload(request);
    const { slideFeatureId } = payload;
    const sessionId = request.params.id;

    const session = await sessionRepository.getById(sessionId);
    if (!session) {
        throw Boom.badRequest(`Session at id: "${sessionId}", doesn't exist`);
    }
    if (session.state !== SessionState.Feature) {
        throw Boom.badRequest(`Session ${session.name} should be in presentation state!`);
    }

    return sessionRepository.updateFields(sessionId, {
        currentSlideFeatureId: slideFeatureId
    } as { [key in keyof SessionModel]: any })
        .then(() => {
            presentationNotifier.setSlideFeature(slideFeatureId, session);
            return {};
        });
}

async function addResults(request: Hapi.Request, responseToolkit: Hapi.ResponseToolkit): Promise<Hapi.Lifecycle.ReturnValueTypes> {
    const clientSessionResults = getPayload<ClientSessionResults[]>(request);
    const sessionId = request.params.id;
    const clientId = request.state['client-id'];
    const clientSystemInfo = userAgentService.mapUserAgent(request.headers['user-agent']);

    const sessionExists = await sessionRepository.exists(sessionId);
    if (!sessionExists) {
        throw Boom.badRequest(`Session at id: "${sessionId}", doesn't exist`);
    }

    const exists = await clientIdentifiersRepository.existInSessionResults(clientId, sessionId);
    if (exists) {
        return {};
    }

    await sessionRepository.addClientResult(
        sessionId,
        {
            ...clientSystemInfo,
            clientIdentifier: clientId,
            clientResults: clientSessionResults
        });

    return {};
}

export default {
    create: <RequestHandler>create,
    get: <RequestHandler>get,
    getById: <RequestHandler>getById,
    setState: <RequestHandler>setState,
    setSlideFeature: <RequestHandler>setSlideFeature,
    addResults: <RequestHandler>addResults
};
