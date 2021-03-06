import * as Mongoose from 'mongoose';
import { SessionState, SupportStatus } from '../../../common';
import { BaseDocument } from './base-document';
import { BrowserInfo, BrowserInfoSchema } from './browser-info';
import { ClientIdentifier, ClientIdentifierSchema } from './client-identifier';
import { VersionInfo, VersionInfoSchema } from './complex-types';

interface ClientSessionResults extends Mongoose.Document {
    featureId: string,
    status: SupportStatus
}

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
        index: true
    },
    clientResults: [ClientSessionResultsSchema],
    system: VersionInfoSchema,
    browser: VersionInfoSchema
});

const SessionSchema = new Mongoose.Schema(
    {
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
        browserInfo: {
            type: [BrowserInfoSchema],
            default: []
        },
        clientIdentifiers: {
            type: [ClientIdentifierSchema],
            default: []
        },
        clientResults: {
            type: [ClientInfoSchema],
            default: []
        }
    },
    {
        timestamps: true
    });

SessionSchema.virtual('id').set(function (id: string): void {
    // @ts-ignore
    this._id = new Mongoose.Types.ObjectId(id);
});

export const SessionModel = Mongoose.model('Session', SessionSchema);
