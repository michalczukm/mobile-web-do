import * as Mongoose from 'mongoose';
import { BaseDocument } from './base-document';
import { SessionState, SupportStatus } from '../../../common';
import { BrowserInfo, BrowserInfoSchema } from './browser-info';
import { ClientIdentifier, ClientIdentifierSchema } from './client-identifier';
import { VersionInfo, VersionInfoSchema } from './complex-types';

interface ClientSessionResults extends Mongoose.Document {
    featureId: string,
    status: SupportStatus
};

interface ClientInfo extends Mongoose.Document {
    clientIdentifier: string,
    clientResults: ClientSessionResults[],
    system: VersionInfo,
    browser: VersionInfo
}

export interface Session extends BaseDocument {
    // shadows Mongose.Document id - which is optional
    // by default it is getter which returns _id to string (hex)
    readonly id: string,
    _id: Mongoose.Types.ObjectId,
    name: string,
    createdAt: Date,
    state: SessionState,
    currentSlideFeatureId: string,
    browserInfo: BrowserInfo[],
    clientIdentifiers: ClientIdentifier[],
    clientResults: ClientInfo[];
}

const ClientSessionResultsSchema = new Mongoose.Schema({
    featureId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const ClientInfoSchema = new Mongoose.Schema({
    clientIdentifier: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    clientResults: [ClientSessionResultsSchema],
    system: VersionInfoSchema,
    browser: VersionInfoSchema
});

// todo add required fields (not in first iteration)
const SessionSchema = new Mongoose.Schema(
    {
        _id: Mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        currentSlideFeatureId: {
            type: String
        },
        browserInfo: BrowserInfoSchema,
        clientIdentifiers: [ClientIdentifierSchema],
        clientResults: [ClientSessionResultsSchema]
    },
    {
        timestamps: true
    });

export const SessionModel = Mongoose.model('Session', BrowserInfoSchema);
