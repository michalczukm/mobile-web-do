import * as Mongoose from 'mongoose';


export default (connectionString: string, options?: {}) => {
    Mongoose.connect(connectionString, options);
};
