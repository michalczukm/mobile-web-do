import * as Mongoose from 'mongoose';

export interface VersionInfo extends Mongoose.Document {
    family: string,
    versionString: string,
    version: {
        major: string,
        minor: string,
        patch: string
    }
}

export const VersionInfoSchema = new Mongoose.Schema({
    family: {
        type: String,
        lowercase: true
    },
    versionString: {
        type: String,
        lowercase: true
    },
    version: {
        major: {
            type: String,
            lowercase: true
        },
        minor: {
            type: String,
            lowercase: true
        },
        patch: {
            type: String,
            lowercase: true
        }
    }
});
