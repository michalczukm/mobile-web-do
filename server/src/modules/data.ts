import { BrowserInfo, ClientIdentifier, Session } from './presentation/models';

/**
 * only in-memory storage for POC
 */
export const DATA = {
    browserInfo: [] as BrowserInfo[],
    clientIdentifiers: [] as ClientIdentifier[],
    sessions: [
        {
            id: '8d4d98a8-eb90-4942-87f2-5fb57e7abc0f',
            name: 'running test session',
            clientIdentifiers: [],
            browserInfo: [],
            state: 'FEATURE'
        },
        {
            id: '8d4d98a8-eb90-4942-87f2-5fb57e7abc0f',
            name: 'not opened test session',
            clientIdentifiers: [],
            browserInfo: [],
            state: 'WELCOME'
        }
    ] as Session[]
};
