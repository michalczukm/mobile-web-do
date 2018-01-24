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
            currentSlideFeatureId: 'home-screen',
            clientResults: []
        },
        {
            id: '7c527737-6728-49ce-b770-3c47eb86ed90',
            name: 'not opened test session',
            clientIdentifiers: [],
            createdAt: new Date(),
            browserInfo: [],
            state: 'WELCOME',
            clientResults: []
        },
        {
            id: '19c4f674-f312-4f7f-94fa-a5e898bb9b46',
            name: 'Goyello',
            clientIdentifiers: [],
            createdAt: new Date(),
            browserInfo: [],
            state: 'WELCOME',
            clientResults: []
        }
    ] as Session[]
};
