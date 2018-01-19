import { DATA } from '../data';
import { Result } from '../../common';
import { BrowserInfo } from './models';

/**
 * For now - only in-memory storage
 */
function add(browserInfo: BrowserInfo): Promise<void> {
    DATA.browserInfo.push(browserInfo);
    return Promise.resolve();
}

export default {
    add
}
