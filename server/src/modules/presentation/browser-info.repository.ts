import { DATA } from '../data';
import { Result } from '../../common';
import { BrowserInfo } from './models';

/**
 * For now - only in-memory storage
 */
function create(browserInfo: BrowserInfo) {
    DATA.browserInfo.push(browserInfo);
    return Promise.resolve(Result.success());
}

export default {
    create
}
