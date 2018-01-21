import { BrowserInfo, ClientIdentifier, Session } from './presentation/models';

/**
 * only in-memory storage for POC
 */
export const DATA = {
    browserInfo: [] as BrowserInfo[],
    clientIdentifiers: [] as ClientIdentifier[],
    sessions: [] as Session[]
};
