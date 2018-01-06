import prune from 'json-prune';
import logger from '../logging/logger';
import sessionService from '../sessions/sessions.service';

const getInfo = () => {
    // some browsers doesn't allow iteration over 'plugins' and 'mimeTypes'
    const navigatorInfo = {};
    for (let i in navigator) navigatorInfo[i] = navigator[i];
    delete navigatorInfo.plugins;
    delete navigatorInfo.mimeTypes;

    // Safari throws Error if we are using uninitialized variable/object - so testing existing classes need type comparison
    return {
        navigator: navigatorInfo,
        window: window,
        'Navigator.prototype': typeof Navigator !== 'undefined' ? Navigator.prototype : null,
        'Window.prototype': typeof Window !== 'undefined' ? Window.prototype : null,
        'ServiceWorker.prototype': typeof ServiceWorker !== 'undefined' ? ServiceWorker.prototype : null,
        'ServiceWorkerRegistration.prototype': typeof ServiceWorkerRegistration !== 'undefined' ? ServiceWorkerRegistration.prototype : null
    };
};

const sendInfo = () => {
    console.log('xyz');

    const sessionId = sessionService.getCurrentSessionId();

    let payloadString = {};
    try {
        payloadString = prune({
            browserInfo: getInfo(),
            sessionId: sessionId
        }, {inheritedProperties: true});
    } catch (error) {
        logger.error('Cannot serialize browser info to JSON', error);
        throw error;
    }

    console.log('=== browser info:', payloadString);
};

export default {
    sendInfo: sendInfo
};
