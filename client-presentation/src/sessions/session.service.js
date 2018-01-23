import featuresService from '../features/features.service';
import configuration from '../configuration';
import { logger } from '../logging/logger';

const getCurrentSessionId = () => window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

function sendClientSessionResults() {
    const sessionId = getCurrentSessionId();
    const featureResults = featuresService.get().map(feature => ({
        id: feature.id,
        status: feature.status,
        isSuccess: feature.testsResult.isSuccess
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
    .catch(reason => logger.error('Sending client results failed', reason));
}

export default {
    getCurrentSessionId,
    sendClientSessionResults
};
