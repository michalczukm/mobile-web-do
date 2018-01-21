import { BrowserInfo } from './browser-info.model';
import { ClientIdentifier } from './client-identifier.model';

export type Session = {
    id: string,
    browserInfo: BrowserInfo[],
    clientIdentifiers: ClientIdentifier[]
};
