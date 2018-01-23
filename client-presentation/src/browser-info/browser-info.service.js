import prune from 'json-prune';
import {
    logger
} from '../logging';
import configuration from '../configuration';
import sessionService from '../sessions';

function getInfo() {
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

function sendInfo() {
    const sessionId = sessionService.getCurrentSessionId();

    var pruneOptions = {
        replacer: (value, defaultValue) => typeof value === 'function' ? JSON.stringify(value.toString()) : defaultValue,
        inheritedProperties: true
    };

    let payloadString = {};
    try {
        payloadString = prune({
            browserInfo: getInfo(),
            sessionId: sessionId
        }, pruneOptions);
    } catch (error) {
        logger.error('Cannot serialize browser info to JSON', error);
        throw error;
    }

    return fetch(`${configuration.apiUrl}/browser-info`, {
        method: 'post',
        mode: 'cors',
        redirect: 'follow',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: payloadString
    })
    .catch(reason => logger.error('Sending browser info failed', reason));
};

export default {
    sendInfo
};
