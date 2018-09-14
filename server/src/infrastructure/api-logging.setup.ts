import * as Hapi from 'hapi';
import { logger } from '../common';

function logErrorRequests(serverInstance: Hapi.Server): void {
    serverInstance.events.on('request', (request: Hapi.Request, event: Hapi.RequestEvent) => {
        if (event.channel === 'error') {
            logger.fatal('### Server Error ### [500] status code. ', {
                error: event.error,
                requestData: request.orig,
                path: request.path
            });
        }
    });
}

export const apiLoggingSetup = (serverInstance: Hapi.Server): void => {
    logErrorRequests(serverInstance);
    logger.setupServerLogging(serverInstance);
};
