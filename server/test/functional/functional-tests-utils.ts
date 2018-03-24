import database from '../../src/data/document-storage/database';

interface TestsSetup {
    setup(): Promise<any>;
    tearDown(): Promise<any>;
}

export const databaseSetup = new class DatabaseSetup implements TestsSetup {
    setup(): Promise<any> {
        return Promise.all([
            database.session.create(
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
