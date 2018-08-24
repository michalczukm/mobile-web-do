import * as Mongoose from 'mongoose';
import * as Hapi from 'hapi';

import { seedDatabase } from '../../src/infrastructure';

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

export const getAdminCredentialsToInject = (): Hapi.AuthCredentials => ({scope: ['openid', 'crud:sessions']});
