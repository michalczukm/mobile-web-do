import * as Hapi from 'hapi';
import * as useragent from 'useragent';
import * as uuid from 'uuid/v4';
import browserInfoRepository from '../browser-info.repository';
import clientIdentifiersRepository from '../client-identifiers.repository';
import sessionRepository from '../session.repository';
import { Result } from '../../../common';
import { RequestHandler } from '../../../hapi-utils';
import { BrowserInfo, VersionInfo } from '../models';

export default {
    create: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const sessionId = request.payload.sessionId;
        const clientId: string = request.state['client-id'] || uuid();

        const addBrowserInfo = () => {
            const browserInfo: BrowserInfo = ({ ...request.payload, ...mapUserAgent(request.headers['user-agent']) });
            return Promise.all([
                clientIdentifiersRepository.add(clientId),
                browserInfoRepository.add(sessionId, clientId, browserInfo)
            ])
                .then(() => reply().code(200).state('client-id', clientId));
        }

        return sessionRepository.exists(sessionId)
            .then(exists => !exists
                ? reply(`Session ${sessionId} not found`).code(404)
                : clientIdentifiersRepository.existInSession(clientId, sessionId)
                    .then(contains => contains
                        ? reply().code(200)
                        : addBrowserInfo())
            )
    }) as RequestHandler
};

function mapUserAgent(userAgentString: string): { browser: VersionInfo, system: VersionInfo } {
    const client = useragent.lookup(userAgentString);
    const os = client.os;

    return {
        browser: {
            family: client.family,
            versionString: client.toString(),
            version: {
                major: client.major,
                minor: client.minor,
                patch: client.patch,
            }
        } as VersionInfo,
        system: {
            family: os.family,
            versionString: os.toString(),
            version: {
                major: os.major,
                minor: os.minor,
                patch: os.patch,
            }
        } as VersionInfo
    };
}
