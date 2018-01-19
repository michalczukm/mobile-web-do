import * as Hapi from 'hapi';
import * as useragent from 'useragent';
import * as uuid from 'uuid/v4';
import browserInfoRepository from '../browser-info.repository';
import requestIdentifiersRepository from '../client-identifiers.repository';
import { Result } from '../../../common';
import { RequestHandler } from '../../../hapi-utils';
import { BrowserInfo, VersionInfo } from 'modules/presentation/models';

export default {
    create: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const addBrowserInfo = () => {
            const newInfo: BrowserInfo = ({ ...request.payload, ...mapUserAgent(request.headers['user-agent']) });
            const newClientId = uuid();
            return Promise.all([
                requestIdentifiersRepository.add(newClientId),
                browserInfoRepository.add(newInfo)
            ])
                .then(() => reply().code(200).state('client-id', newClientId));
        }

        const currentClientId: string = request.state['client-id'] || '';

        return requestIdentifiersRepository.contains(currentClientId)
            .then(contains => contains
                ? reply().code(200)
                : addBrowserInfo())
            .catch(reason => reply(reason).code(500));
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
