import featuresService from '../features/features.service';
import configuration from '../configuration';
import {
    logger
} from '../logging/logger';
import {handleResponse} from '../utils/http-utils';

const getCurrentSessionId = () => (new URL(document.location)).searchParams.get('sessionId');

function sendClientSessionResults() {
    const sessionId = getCurrentSessionId();
    const featureResults = featuresService.get().map(feature => ({
        featureId: feature.id,
        status: feature.status
    }));

    return fetch(`${configuration.apiUrl}/sessions/${sessionId}/results`, {
        method: 'post',
        mode: 'cors',
        redirect: 'follow',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(featureResults)
    })
        .then(handleResponse)
        .catch(reason => logger.error('Sending client results failed', reason));
}

function getSessionResults() {
    const sessionId = getCurrentSessionId();

    return fetch(`${configuration.apiUrl}/sessions/${sessionId}/results`, {
        mode: 'cors',
        redirect: 'follow'
    })
        .then(handleResponse)
        .then(response => response.json())
        .catch(reason => logger.error('Fetching session results failed', reason));
}

function getCurrentSession() {
    const sessionId = getCurrentSessionId();

    return fetch(`${configuration.apiUrl}/sessions/${sessionId}`, {
        mode: 'cors',
        redirect: 'follow'
    })
        .then(handleResponse)
        .then(response => response.json());
}

export default {
    getCurrentSessionId,
    sendClientSessionResults,
    getSessionResults,
    getCurrentSession
};
