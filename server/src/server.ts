import * as Hapi from 'hapi';
import * as inert from 'inert';
import * as vision from 'vision';
import * as Path from 'path';
import * as dotenv from 'dotenv';
import * as hapiSwagger from 'hapi-swagger';
import staticModule from './modules/static';
import presentationModule from './modules/presentation';
import databaseSetup from './infrastructure/database.setup';

dotenv.config();

const env = {
  serverPort: process.env.PORT,
  dbHost: process.env.DB_HOST
};

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
}

const loadModules = (serverInstance: Hapi.Server) => {
  presentationModule.register(serverInstance, serverInstance);
  staticModule.register(serverInstance);
};

const startServer = (serverInstance: Hapi.Server) => serverInstance.register([
  inert, vision as any as Hapi.PluginFunction<any>,
  {
    register: hapiSwagger,
    options: swaggerOptions
  } as Hapi.PluginRegistrationObject<any>
]).then(() => {

  databaseSetup({
    connectionString: env.dbHost
  });

  loadModules(setupApiConnection(serverInstance));

  serverInstance.start((err) => {
    if (err) {
      throw err;
    }

    serverInstance.connections.forEach(connection => console.log('Server running at:', connection.info.uri));
  });
}).catch((error: Error) => {
  console.error('Server plugins registration failed!');
  throw error;
});


export default startServer;
