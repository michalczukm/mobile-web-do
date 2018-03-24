import * as Mongoose from 'mongoose';

export const init = (config: { connectionString: string }, options?: {}) => {
    Mongoose.connect(config.connectionString, options);

    Mongoose.connection
        .on('error', () => console.log(`### Error: Unable to connect to database: ${config.connectionString}`))
        .once('open', () => console.log(`=== Connected to database: ${config.connectionString}`));
};

export const dispose = () => {
    Mongoose.disconnect();
};
