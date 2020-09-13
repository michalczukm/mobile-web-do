import prune from 'json-prune';
import { logger } from '../logging';
import configuration from '../configuration';
import sessionService from '../sessions';
import { handleResponse } from '../utils/http-utils';

const WINDOW_EXCLUDED_PROPS = [
    'document',
    'parent',
    'top',
    'window',
    'frames',
    'self',
    'navigator',
    // project specific keys
    'Prism',
    'regeneratorRuntime',
    'FontAwesomeCdnConfig',
    'webpackJsonp',
];

// some browsers doesn't allow iteration over 'plugins' and 'mimeTypes'
const NAVIGATOR_EXCLUDED_PROPS = ['plugins', 'mimeTypes'];

const isChromeExtensionsByConvention = key => !!key.match(/^[__]{2}/);

const getInfo = () => {
    const navigatorInfo = {};
    // for in gives us not only enumerable fields
    for (let key in navigator) {
        if (!NAVIGATOR_EXCLUDED_PROPS.includes(key)) {
            navigatorInfo[key] = navigator[key];
        }
    }

    const windowInfo = {};
    // for in gives us not only enumerable fields
    for (let key in window) {
        if (!(isChromeExtensionsByConvention(key) || WINDOW_EXCLUDED_PROPS.includes(key))) {
            windowInfo[key] = window[key];
        }
    }

    // Safari throws Error if we are using uninitialized variable/object - so testing existing classes need type comparison
    return {
        navigator: navigatorInfo,
        window: windowInfo,
        'Navigator.prototype': typeof Navigator !== 'undefined' ? Navigator.prototype : null,
        'Window.prototype': typeof Window !== 'undefined' ? Window.prototype : null,
        'ServiceWorker.prototype':
            typeof ServiceWorker !== 'undefined' ? ServiceWorker.prototype : null,
        'ServiceWorkerRegistration.prototype':
            typeof ServiceWorkerRegistration !== 'undefined'
                ? ServiceWorkerRegistration.prototype
                : null,
    };
};

const sendInfo = async () => {
    const sessionId = sessionService.getCurrentSessionId();

    const pruneOptions = {
        replacer: (value, defaultValue) =>
            typeof value === 'function' ? JSON.stringify(value.toString()) : defaultValue,
        inheritedProperties: true,
    };

    let payloadString = {};
    try {
        payloadString = prune(
            {
                browserInfo: getInfo(),
                sessionId: sessionId,
            },
            pruneOptions,
        );
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
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: payloadString,
    }).then(handleResponse);
};

export default {
    sendInfo,
};
