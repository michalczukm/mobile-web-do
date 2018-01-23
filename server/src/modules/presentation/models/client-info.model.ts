import { VersionInfo } from './version-info.model';

export enum SupportStatus {
    STANDARD = 'STANDARD',
    VENDOR_SPECIFIC = 'VENDOR_SPECIFIC',
    NO_SUPPORT = 'NO_SUPPORT'
}

export type ClientSessionResults = {
    featureId: string,
    status: SupportStatus
};

export type ClientInfo = {
    clientIdentifier: string,
    clientResults: ClientSessionResults[],
    system: VersionInfo,
    browser: VersionInfo
};
