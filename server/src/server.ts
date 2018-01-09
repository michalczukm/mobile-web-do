'use strict';

const Hapi = require('hapi');
const inert = require('inert');
const vision = require('vision');
const hapiSwagger = require('hapi-swagger');
const Pack = require('../package.json');
const io = require('socket.io');
const Rx = require('@reactivex/rxjs');

const swaggerOptions = {
  basePath: '/api/',
  pathPrefixSize: 2,
  payloadType: 'json',
  info: {
    title: Pack.description,
    version: Pack.version
  }
};

const messageSubject = new Rx.Subject();

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
websocket.on('disconnect', (client) => console.log(`${client} disconnected`));

const addRoutes = () => {
  require('./modules/presentation/presentation.routes')(apiConnection);

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

server.register([
  inert, vision,
  {
    register: hapiSwagger,
    options: swaggerOptions
  }
]).then(() => {

  addRoutes();

  server.start((err) => {
    if (err) {
      throw err;
    }

    server.connections.forEach(connection => console.log('Server running at:', connection.info.uri));
  });
}).catch(error => {
  console.error('Server plugins registration failed!');
  throw error;
});
