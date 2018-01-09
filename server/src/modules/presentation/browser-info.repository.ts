const data = require('../data');
const Result = require('../../common/result');

/**
 * For now - only in-memory storage
 */
function create(browserInfo) {
    data.browserInfo.push(browserInfo);
    return Promise.resolve(Result.success());
}

module.exports = {
    create
}
