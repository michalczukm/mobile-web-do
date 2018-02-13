import * as Mongoose from 'mongoose';
import { BaseDocument } from './base-document';

export interface ClientIdentifier extends BaseDocument {
    identifier: string,
    createdAt: Date
}

export const ClientIdentifierSchema = new Mongoose.Schema(
    {
        _id: Mongoose.Schema.Types.ObjectId,
        identifier: {
            type: String,
            required: true,
            index: true,
            unique: true
        }
    },
    {
        timestamps: true
    });

export const ClientIdentifierModel = Mongoose.model('ClientIdentifier', ClientIdentifierSchema);
