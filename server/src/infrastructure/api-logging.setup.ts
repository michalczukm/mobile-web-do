import * as Hapi from 'hapi';
import { logger } from '../common';

export const apiLoggingSetup = (serverInstance: Hapi.Server): void =>
    serverInstance.on('request-error', (request, err) => {
        // log 500 http code
        logger.fatal('### Server Error ### [500] status code. ', {
            error: err,
            requestData: request.orig,
            path: request.path
        });
    });
