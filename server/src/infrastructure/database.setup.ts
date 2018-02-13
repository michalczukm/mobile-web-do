import * as Mongoose from 'mongoose';


export default (config: { connectionString: string }, options?: {}) => {
    Mongoose.connect(config.connectionString, options);

    Mongoose.connection
        .on('error', () => console.log(`Unable to connect to database: ${config.connectionString}`))
        .once('open', () => console.log(`Connected to database: ${config.connectionString}`));
};
