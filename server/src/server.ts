import * as Hapi from 'hapi';
import * as Path from 'path';
import * as hapiSwagger from 'hapi-swagger';
import * as jwksRsa from 'jwks-rsa';

import staticModule from './modules/static';
import presentationModule from './modules/presentation';
import { apiLoggingSetup, databaseSetup, environmentConfig, seedDatabase } from './infrastructure';
const env = environmentConfig;

const Pack = require('../package.json');

const swaggerOptions = {
    basePath: '/api/',
    pathPrefixSize: 2,
    payloadType: 'json',
    info: {
        title: Pack.description,
        version: Pack.version
    }
};

const validateUser = (decoded: any, request: Hapi.Request, callback: (_: any, isValid: boolean, payload?: object) => any) => {
    if (decoded && decoded.sub) {
        if (decoded.scope) {
            return callback(null, true, {
                scope: decoded.scope.split(' ')
            });
        }

        return callback(null, true);
    }

    return callback(null, false);
};

const setupApiConnection = (): Hapi.Server => {
    const server = new Hapi.Server({
            port: env.serverPort,
            router: {
                stripTrailingSlash: true
            },
            routes: {
                cors: {
                    origin: ['*'],
                    credentials: true
                },
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
    serverInstance.auth.strategy('jwt', 'jwt', {
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
        },
        verify: validateUser
    });
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
    const server = setupApiConnection();

    await server.register([
        require('inert'),
        require('vision'),
        require('hapi-auth-jwt2')
        // {
        //     plugin: hapiSwagger,
        //     options: swaggerOptions
        // } as Hapi.Plugin<any>
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
