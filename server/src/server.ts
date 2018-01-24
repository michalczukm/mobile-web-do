import * as Hapi from 'hapi';
import * as inert from 'inert';
import * as vision from 'vision';
import * as hapiSwagger from 'hapi-swagger';
import presentationModule from './modules/presentation';
import staticModule from './modules/static';
import * as Path from 'path';

const Pack = require('../package.json');
const serverPort = process.env.PORT || 5050;

const swaggerOptions = {
  basePath: '/api/',
  pathPrefixSize: 2,
  payloadType: 'json',
  info: {
    title: Pack.description,
    version: Pack.version
  }
};

const server = new Hapi.Server();

const apiConnection = server.connection({
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

const loadModules = (serverInstance: Hapi.Server) => {
  presentationModule.register(serverInstance, serverInstance);
  staticModule.register(serverInstance);
};

server.register([
  inert, vision as any as Hapi.PluginFunction<any>,
  {
    register: hapiSwagger,
    options: swaggerOptions
  } as Hapi.PluginRegistrationObject<any>
]).then(() => {

  loadModules(apiConnection);

  server.start((err) => {
    if (err) {
      throw err;
    }

    server.connections.forEach(connection => console.log('Server running at:', connection.info.uri));
  });
}).catch((error: Error) => {
  console.error('Server plugins registration failed!');
  throw error;
});
