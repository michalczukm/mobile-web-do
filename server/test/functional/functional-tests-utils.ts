import database from '../../src/data/document-storage/database';
import testConstants from './tests.constants';

export interface TestsSetup {
    setup(): Promise<any>;
    tearDown(): Promise<any>;
}

const databaseSetup = new class DatabaseSetup implements TestsSetup {
    setup(): Promise<any> {
        return Promise.all([
            database.session.create(
                {
                    id: testConstants.sessionIdFeatureState,
                    name: 'running test session',
                    createdAt: new Date(),
                    clientIdentifiers: [],
                    browserInfo: [],
                    state: 'FEATURE',
                    currentSlideFeatureId: 'home-screen',
                    clientResults: []
                },
                {
                    id: testConstants.sessionIdWelcomeState,
                    name: 'not opened test session',
                    clientIdentifiers: [],
                    createdAt: new Date(),
                    browserInfo: [],
                    state: 'WELCOME',
                    clientResults: [],
                    currentSlideFeatureId: '',
                },
                {
                    id: '5ab6f400ae92cba4516d534c',
                    name: 'company specific session',
                    clientIdentifiers: [],
                    createdAt: new Date(),
                    browserInfo: [],
                    state: 'WELCOME',
                    clientResults: [],
                    currentSlideFeatureId: '',
                }).catch(reason => this.onRejected('session')(reason))
        ]);
    }

    tearDown(): Promise<any> {
        return database.session.db.dropDatabase().catch(reason => {
            console.error('Cannot drop database!', reason);
            throw reason;
        });
    }

    private onRejected = (entityName: string) => (reason: any) => {
        console.error(`Failed at seeding ${entityName}`);
        throw reason;
    };
}();


export const integrationTestsSetupBuilder = {
    withStandardSetup: (): TestsSetup => databaseSetup
};
