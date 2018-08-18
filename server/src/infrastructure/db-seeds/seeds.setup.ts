import * as Mongoose from 'mongoose';

import database from '../../data/document-storage/database';
import seedConstants from './seed.constants';

export const seedDatabase = async (config: { isProduction: boolean }): Promise<void> => {
    const anyCollections: boolean = await checkIfAnyCollectionsInDb();

    // don't seed for production env or if there are any collections in db
    if (config.isProduction || anyCollections) {
        return;
    }

    return Promise.all([
        seedSessions()
    ])
        .then(() => console.log(`### Database seeded, ${new Date()}`));
};

const checkIfAnyCollectionsInDb = (): Promise<boolean> => new Promise<boolean>((resolve, reject) => {
    Mongoose.connection.db.listCollections()
        .next((error, result) => {
                if (error) {
                    reject(error)
                } else if (result) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        )
});

const seedSessions = (): Promise<any> => {
    return database.session.create(
        {
            id: seedConstants.sessionIdFeatureState,
            name: 'running test session',
            createdAt: new Date(),
            clientIdentifiers: [],
            browserInfo: [],
            state: 'FEATURE',
            currentSlideFeatureId: 'home-screen',
            clientResults: []
        },
        {
            id: seedConstants.sessionIdWelcomeState,
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
        })
        .catch(reason => onRejected('session')(reason));
};

const onRejected = (entityName: string) => (reason: any) => {
    console.error(`Failed at seeding ${entityName}`);
    throw reason;
};
