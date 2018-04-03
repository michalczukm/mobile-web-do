import * as Mongoose from 'mongoose';

import { seedDatabase } from '../../src/infrastructure/db-seeds';

export interface TestsSetup {
    setup(): Promise<any>;

    tearDown(): Promise<any>;
}

const databaseSetup = new class DatabaseSetup implements TestsSetup {
    setup(): Promise<any> {
        return seedDatabase({ isProduction: false });
    }

    tearDown(): Promise<any> {
        return Mongoose.connection.db.dropDatabase()
            .then(() => console.log('Db dropped in tear down.'))
            .catch(reason => {
                console.error('Cannot drop database!', reason);
                throw reason;
            });
    }
}();


export const integrationTestsSetupBuilder = {
    withStandardSetup: (): TestsSetup => databaseSetup
};
