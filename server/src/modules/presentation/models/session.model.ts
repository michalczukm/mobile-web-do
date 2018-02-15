import { BrowserInfoModel } from './browser-info.model';
import { ClientIdentifierModel } from './client-identifier.model';
import { ClientInfoModel } from './client-info.model';
import { SessionState } from '../../../common';

export type SessionModel = {
    id: string,
    name: string,
    createdAt: Date,
    state: SessionState,
    currentSlideFeatureId: string,
    browserInfo: BrowserInfoModel[],
    clientIdentifiers: ClientIdentifierModel[],
    clientResults: ClientInfoModel[];
};
