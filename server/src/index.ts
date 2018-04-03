import * as Hapi from 'hapi';
import startServer from './server';
import { logger } from './common';

process.on('uncaughtException', (error: Error) => {
    logger.error(`uncaughtException: ${error.message}`, error);
});

process.on('unhandledRejection', (reason: any) => {
    logger.error('unhandledRejection', reason);
});

const server = new Hapi.Server();

startServer(server);

// stop the server on SIGINT signal
// server.stop clarification: https://github.com/hapijs/discuss/issues/82
process.on('SIGINT', () => {
    console.log('=== stopping hapi server');

    server.stop({ timeout: 10000 }).then(error => {
        console.log('=== hapi server stopped');
        process.exit((error) ? 1 : 0);
    });
});
