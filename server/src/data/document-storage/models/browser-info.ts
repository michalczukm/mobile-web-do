import * as Mongoose from 'mongoose';
import { BaseDocument } from './base-document';
import { VersionInfo, VersionInfoSchema } from './complex-types';

export interface BrowserInfo extends BaseDocument {
    system: VersionInfo,
    browser: VersionInfo
    navigator: Object,
    window: Object,
    userAgent: string,
    'Navigator.prototype': Object,
    'Window.prototype': Object,
    'ServiceWorker.prototype': Object,
    'ServiceWorkerRegistration.prototype': Object
}

// todo add required fields (not in first iteration)
export const BrowserInfoSchema = new Mongoose.Schema(
    {
        _id: Mongoose.Schema.Types.ObjectId,
        system: VersionInfoSchema,
        browser: VersionInfoSchema,
        navigator: {
            type: Object
        },
        window: {
            type: Object
        },
        userAgent: {
            type: String
        },
        'Navigator.prototype': {
            type: Object
        },
        'Window.prototype': {
            type: Object
        },
        'ServiceWorker.prototype': {
            type: Object
        },
        'ServiceWorkerRegistration.prototype': {
            type: Object
        }
    },
    {
        timestamps: true
    });

export const BrowserInfoModel = Mongoose.model('BrowserInfo', BrowserInfoSchema);
