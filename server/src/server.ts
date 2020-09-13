import * as Hapi from '@hapi/hapi';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as Joi from 'joi';
import * as hapiAuthJwt2 from 'hapi-auth-jwt2';
import * as Path from 'path';

import staticModule from './modules/static';
import presentationModule from './modules/presentation';
import {
  apiLoggingSetup,
  authSetup,
  databaseSetup,
  EnvironmentConfig,
  environmentConfig,
  seedDatabase,
} from './infrastructure';

const env: EnvironmentConfig = environmentConfig;

const setupConnection = (): Hapi.Server => {
  const server = new Hapi.Server({
    port: env.serverPort,
    router: {
      stripTrailingSlash: true,
    },
    routes: {
      cors: env.corsSetup,
      files: {
        relativeTo: Path.join(__dirname, 'client-dist'),
      },
    },
  });

  server.state('client-id', {
    ttl: null,
    isSecure: false,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false,
    strictHeader: true,
    isSameSite: false,
  });

  return server;
};

const setupAuth = (serverInstance: Hapi.Server): void => {
  authSetup(serverInstance, env);
};

const loadSeeds = (isProduction: boolean): Promise<any> =>
  seedDatabase({ isProduction });

const loadModules = (serverInstance: Hapi.Server): void => {
  presentationModule.register(serverInstance, serverInstance);
  staticModule.register(serverInstance);
};

const setupLogging = async (serverInstance: Hapi.Server): Promise<void> =>
  apiLoggingSetup(serverInstance);

const setupServer = async (): Promise<Hapi.Server> => {
  const server = setupConnection();

  server.validator(Joi);

  await server.register([
    { plugin: Inert },
    { plugin: Vision },
    { plugin: hapiAuthJwt2 },
  ]);
  await databaseSetup.init(
    { connectionString: env.dbHost },
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  );
  await loadSeeds(env.isProd);
  server.events.on('stop', () => databaseSetup.dispose());

  setupAuth(server);
  loadModules(server);
  await setupLogging(server);

  return server;
};

export default setupServer;
