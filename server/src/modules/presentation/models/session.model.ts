import { BrowserInfo } from './browser-info.model';
import { ClientIdentifier } from './client-identifier.model';
import { ClientInfo } from './client-info.model';
import { SessionState } from '../../../common';

export type Session = {
    id: string,
    name: string,
    createdAt: Date,
    state: SessionState,
    currentSlideFeatureId: string,
    browserInfo: BrowserInfo[],
    clientIdentifiers: ClientIdentifier[],
    clientResults: ClientInfo[];
};
