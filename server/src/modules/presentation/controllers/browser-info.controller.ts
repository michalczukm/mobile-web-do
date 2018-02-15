import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as uuid from 'uuid/v4';

import {
    sessionRepository, browserInfoRepository,
    clientIdentifiersRepository
} from '../data-access';

import { Result } from '../../../common';
import { RequestHandler } from '../../../hapi-utils';
import { BrowserInfoModel, VersionInfo } from '../models';
import { userAgentService } from '../services/browser-info'

function create(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const sessionId = request.payload.sessionId;
    const clientId: string = request.state['client-id'] || uuid();

    const addBrowserInfo = () => {
        const browserInfo: BrowserInfoModel = ({
            ...request.payload, ...userAgentService.mapUserAgent(request.headers['user-agent'])
        });

        return Promise.all([
            clientIdentifiersRepository.add(clientId),
            browserInfoRepository.add(sessionId, clientId, browserInfo)
        ])
            .then(() => reply().state('client-id', clientId));
    }

    return sessionRepository.exists(sessionId)
        .then(exists => !exists
            ? reply(Boom.notFound(`Session ${sessionId} not found`))
            : clientIdentifiersRepository.existInSession(clientId, sessionId)
                .then(contains => contains
                    ? reply()
                    : addBrowserInfo())
        )
}

export default {
    create: <RequestHandler>create
};
