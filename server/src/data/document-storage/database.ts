import * as Mongoose from 'mongoose';
import {
    BrowserInfo, ClientIdentifier, Session, BrowserInfoModel,
    ClientIdentifierModel, SessionModel
} from './models';

export interface DatabaseContext {
    browserInfo: Mongoose.Model<BrowserInfo>;
    clientIdentifier: Mongoose.Model<ClientIdentifier>;
    session: Mongoose.Model<Session>;
}

export const dbContext = <DatabaseContext>{
    browserInfo: BrowserInfoModel,
    clientIdentifier: ClientIdentifierModel,
    session: SessionModel
};
