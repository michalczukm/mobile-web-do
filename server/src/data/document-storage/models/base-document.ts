import * as Mongoose from 'mongoose';

export interface BaseDocument extends Mongoose.Document {
    // fields automatically added with `timestamps: true` schema option
    createdAt: Date,
    updatedAt: Date
}
