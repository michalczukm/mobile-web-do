import * as Hapi from '@hapi/hapi';
import setupServer from './server';
import { logger } from './common';

function subscribeForNodeExceptions(): void {
    process.on('uncaughtException', (error: Error) => {
        logger.error(`uncaughtException: ${error.message}`, error);
    });

    process.on('unhandledRejection', (reason: any) => {
        logger.error('unhandledRejection', reason);
    });
}

function subscribeForNodeSignals(serverInstance: Hapi.Server): void {
    process.on('SIGINT', async () => {
        console.log('=== stopping hapi server');

        await serverInstance.stop({ timeout: 10000 });

        console.log('=== hapi server stopped');
        process.exit(0);
    });
}


subscribeForNodeExceptions();


(async () => {
    try {
        const server: Hapi.Server = await setupServer();
        await server.start();

        subscribeForNodeSignals(server);
        console.log('Server running at:', server.info.uri);
    } catch (err) {
        console.error('Server plugins registration failed!', err);
        process.exit(1);
    }
})();


// stop the server on SIGINT signal
// server.stop clarification: https://github.com/hapijs/discuss/issues/82
