import { BrowserInfo } from './browser-info.model';
import { ClientIdentifier } from './client-identifier.model';
import * as uuid from 'uuid/v4';

export type Session = {
    id: string,
    name: string,
    state: SessionState,
    currentSlideFeatureId: string,
    browserInfo: BrowserInfo[],
    clientIdentifiers: ClientIdentifier[]
};

export enum SessionState {
    Welcome = 'WELCOME',
    Feature = 'FEATURE',
    Summary = 'SUMMARY',
    Closed = 'CLOSED'
};
