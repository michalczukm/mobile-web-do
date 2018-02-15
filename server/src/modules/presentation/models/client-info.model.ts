import { VersionInfo } from './version-info.model';
import { SupportStatus } from '../../../common';

export type ClientSessionResults = {
    featureId: string,
    status: SupportStatus
};

export type ClientInfoModel = {
    clientIdentifier: string,
    clientResults: ClientSessionResults[],
    system: VersionInfo,
    browser: VersionInfo
};
