import { DATA } from '../../data';
import { BrowserInfoModel } from '../models';

/**
 * For now - only in-memory storage
 */
function add(sessionId: string, clientIdentifier: string, browserInfo: BrowserInfoModel): Promise<void> {
    const session = DATA.sessions.find(s => s.id === sessionId);
    session.browserInfo.push(browserInfo);
    session.clientIdentifiers.push({ identifier: clientIdentifier, createdAt: new Date() });

    DATA.browserInfo.push(browserInfo);
    return Promise.resolve();
}

export default {
    add
}
