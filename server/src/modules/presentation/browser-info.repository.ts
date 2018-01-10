import { DATA } from '../data';
import { Result } from '../../common';

/**
 * For now - only in-memory storage
 */
function create(browserInfo) {
    DATA.browserInfo.push(browserInfo);
    return Promise.resolve(Result.success());
}

export default {
    create
}
