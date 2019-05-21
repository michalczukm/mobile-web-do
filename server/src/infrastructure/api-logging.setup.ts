import * as Hapi from 'hapi';
import { logger } from '../common';
import goodOptions from './configuration/good-plugin.config';

async function logRequests(serverInstance: Hapi.Server): Promise<void> {
    await serverInstance.register({
        plugin: require('good'),
        options: goodOptions,
    });
}

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

export const apiLoggingSetup = async (serverInstance: Hapi.Server): Promise<void> => {
    logErrorRequests(serverInstance);
    logger.setupServerLogging(serverInstance);
    /**
     * Heroku have some problem with writing to files, probably due to size quota
     * I disabled logging to files till finding workaround or move to some storage with logs (preferable)
     */
    await logRequests(serverInstance);
};
