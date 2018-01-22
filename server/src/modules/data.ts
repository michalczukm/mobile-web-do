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
            createdAt: new Date(),
            clientIdentifiers: [],
            browserInfo: [],
            state: 'FEATURE',
            currentSlideFeatureId: 'home-screen'
        },
        {
            id: '7c527737-6728-49ce-b770-3c47eb86ed90',
            name: 'not opened test session',
            clientIdentifiers: [],
            createdAt: new Date(),
            browserInfo: [],
            state: 'WELCOME'
        }
    ] as Session[]
};
