import * as Hapi from 'hapi';
import * as inert from 'inert';
import * as vision from 'vision';
import * as Path from 'path';
import * as hapiSwagger from 'hapi-swagger';
import * as jwt from 'hapi-auth-jwt2';
import * as jwksRsa from 'jwks-rsa';

import staticModule from './modules/static';
import presentationModule from './modules/presentation';
import { seedDatabase, databaseSetup, environmentConfig } from './infrastructure';

const env = environmentConfig;

const Pack = require('../package.json');
const serverPort = env.serverPort || 5050;

const swaggerOptions = {
    basePath: '/api/',
    pathPrefixSize: 2,
    payloadType: 'json',
    info: {
        title: Pack.description,
        version: Pack.version
    }
};

const setupApiConnection = (serverInstance: Hapi.Server): Hapi.Server => {
    const apiConnection = serverInstance.connection({
        labels: ['api', 'web-sockets'],
        port: serverPort,
        routes: {
            cors: {
                origin: ['*'],
                credentials: true
            },
            files: {
                relativeTo: Path.join(__dirname, 'client-dist')
            }
        }
    });

    apiConnection.state('client-id', {
        ttl: null,
        isSecure: false,
        isHttpOnly: true,
        encoding: 'base64json',
        clearInvalid: false,
        strictHeader: true,
        isSameSite: false
    });

    return apiConnection;
};

const setupAuth = (serverInstance: Hapi.Server): void => {
    serverInstance.auth.strategy('jwt', 'jwt', 'required', {
        complete: true,
        key: jwksRsa.hapiJwt2Key({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: env.auth.jwksUri
        }),
        verifyOptions: {
            audience: '/admin',
            issuer: env.auth.issuer,
            algorithms: ['RS256']
        }
    });
};

const loadSeeds = (isProduction: boolean): Promise<any> => seedDatabase({ isProduction });

const loadModules = (serverInstance: Hapi.Server): void => {
    presentationModule.register(serverInstance, serverInstance);
    staticModule.register(serverInstance);
};

const startServer = (serverInstance: Hapi.Server) =>
    serverInstance.register([
        inert, vision as any as Hapi.PluginFunction<any>, jwt,
        {
            register: hapiSwagger,
            options: swaggerOptions
        } as Hapi.PluginRegistrationObject<any>
    ])
        .then(() =>
            databaseSetup.init({ connectionString: env.dbHost },
                {
                    socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }
                }))
        .then(() => loadSeeds(env.isProd))
        .then(() => {
            serverInstance.on('stop', () => databaseSetup.dispose());
            loadModules(setupApiConnection(serverInstance));
            setupAuth(serverInstance);

            serverInstance.start((err) => {
                if (err) {
                    throw err;
                }

                serverInstance.connections.forEach(connection => console.log('Server running at:', connection.info.uri));
            });
        })
        .catch((error: Error) => {
            console.error('Server plugins registration failed!');
            throw error;
        });

export default startServer;
