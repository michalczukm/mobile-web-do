import * as Mongoose from 'mongoose';

const defaultConnectionOptions = {
    useNewUrlParser: true
};

export const databaseSetup = {
    init: (config: { connectionString: string }, options?: {}): Promise<any> => {
        Mongoose.connection
            .on('error', () => console.log(`### Error: Unable to connect to database: ${config.connectionString}`))
            .once('open', () => console.log(`=== Connected to database: ${config.connectionString}`));

        return Mongoose.connect(config.connectionString, { ...defaultConnectionOptions, ...options });
    },
    dispose: () => {
        Mongoose.disconnect();
    }
};

