import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { v4 as uuidv4} from 'uuid'

import { browserInfoRepository, sessionRepository } from '../data-access';

import { getPayload, RequestHandler } from '../../../hapi-utils';
import { BrowserInfoModel } from '../models';
import { userAgentService } from '../services/browser-info'
import clientIdentifiersRepository from '../data-access/client-identifiers.repository';

async function create(request: Hapi.Request, responseToolkit: Hapi.ResponseToolkit): Promise<Hapi.Lifecycle.ReturnValueTypes> {
    const payload: any = getPayload(request);

    const sessionId = payload.sessionId;
    const clientId: string = request.state['client-id'] || uuidv4();

    const addBrowserInfo = async () => {
        const browserInfo: BrowserInfoModel = ({
            ...payload, ...userAgentService.mapUserAgent(request.headers['user-agent'])
        });

        await Promise.all([
            clientIdentifiersRepository.add(clientId),
            browserInfoRepository.add(sessionId, clientId, browserInfo)
        ]);

        return responseToolkit.response().state('client-id', clientId);
    };

    const exists = await sessionRepository.exists(sessionId);
    if (!exists) {
        throw Boom.notFound(`Session ${sessionId} not found`);
    } else if (!await clientIdentifiersRepository.existInSession(clientId, sessionId)) {
        return await addBrowserInfo();
    }

    return {};
}

export default {
    create: <RequestHandler>create
};
