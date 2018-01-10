import * as Hapi from 'hapi';
import * as inert from 'inert';
import * as vision from 'vision';
import * as hapiSwagger from 'hapi-swagger';
import * as io from 'socket.io';
import { Subject } from '@reactivex/rxjs';
import presentationModule from './modules/presentation';

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

const messageSubject = new Subject();

const server = new Hapi.Server();

const apiConnection = server.connection({
  labels: ['api'],
  port: process.env.PORT || 5050,
  routes: {
    cors: true
  }
});

const websocketsConnection = server.connection({
  labels: ['websockets'],
  port: process.env.PORT + 1 || 5051,
  routes: {
    cors: true
  }
})

const websocket = io(websocketsConnection.listener);

websocket.on('connection', function (socket) {
  messageSubject.subscribe(message => socket.emit('switch-slide', message));
});
websocket.on('disconnect', () => console.log(`client disconnected`));

const addRoutes = () => {
  apiConnection.route({
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: '/',
    handler: (request, reply) => {
      messageSubject.next({
        content: `The ${new Date()} is here.`
      });
      return reply(`Test message`);
    }
  });
};

const loadModules = (serverInstance: Hapi.Server) => {
  presentationModule.register(serverInstance);
}

server.register([
  inert, vision as any as Hapi.PluginFunction<any>,
  {
    register: hapiSwagger,
    options: swaggerOptions
  } as Hapi.PluginRegistrationObject<any>
]).then(() => {

  addRoutes();
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
