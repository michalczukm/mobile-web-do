import * as Hapi from 'hapi';
import * as Path from 'path';

import staticModule from './modules/static';
import presentationModule from './modules/presentation';
import { apiLoggingSetup, authSetup, databaseSetup, EnvironmentConfig, environmentConfig, seedDatabase } from './infrastructure';

const env: EnvironmentConfig = environmentConfig;

const setupConnection = (): Hapi.Server => {
    const server = new Hapi.Server({
            port: env.serverPort,
            router: {
                stripTrailingSlash: true
            },
            routes: {
                cors: env.corsSetup,
                files: {
                    relativeTo: Path.join(__dirname, 'client-dist')
                }
            }
        }
    );

    server.state('client-id', {
        ttl: null,
        isSecure: false,
        isHttpOnly: true,
        encoding: 'base64json',
        clearInvalid: false,
        strictHeader: true,
        isSameSite: false
    });

    return server;
};

const setupAuth = (serverInstance: Hapi.Server): void => {
    authSetup(serverInstance, env);
};

const loadSeeds = (isProduction: boolean): Promise<any> => seedDatabase({ isProduction });

const loadModules = (serverInstance: Hapi.Server): void => {
    presentationModule.register(serverInstance, serverInstance);
    staticModule.register(serverInstance);
};

const setupLogging = (serverInstance: Hapi.Server): void => {
    apiLoggingSetup(serverInstance);
};

const setupServer = async (): Promise<Hapi.Server> => {
    const server = setupConnection();

    await server.register([
        require('inert'),
        require('vision'),
        require('hapi-auth-jwt2')
    ]);
    await databaseSetup.init({ connectionString: env.dbHost },
        {
            socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }
        });
    await loadSeeds(env.isProd);
    server.events.on('stop', () => databaseSetup.dispose());

    setupAuth(server);
    loadModules(server);
    setupLogging(server);

    return server;
};

export default setupServer;
