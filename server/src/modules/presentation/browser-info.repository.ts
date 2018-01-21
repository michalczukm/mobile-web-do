import { DATA } from '../data';
import { Result } from '../../common';
import { BrowserInfo } from './models';

/**
 * For now - only in-memory storage
 */
function add(sessionId: string, clientId: string, browserInfo: BrowserInfo): Promise<void> {
    DATA.sessions.find(session => session.id === sessionId).browserInfo.push(browserInfo);
    DATA.browserInfo.push(browserInfo);
    return Promise.resolve();
}

export default {
    add
}
