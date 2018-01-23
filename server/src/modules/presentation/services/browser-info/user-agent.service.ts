import * as useragent from 'useragent';

import { VersionInfo } from '../../models/version-info.model';

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

export const userAgentService = {
    mapUserAgent
};
