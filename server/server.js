'use strict';

const Hapi = require('hapi');
const inert = require('inert');
const vision = require('vision');
const hapiSwagger = require('hapi-swagger');
const Pack = require('./package.json');

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

server.connection({
  port: process.env.PORT || 5050,
  routes: {
    cors: true
  }
});

server.realm.modifiers.route.prefix = '/api';

const addRoutes = () => {
  server.route({
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: '/',
    handler: (request, reply) => {
      return reply(`Test message`);
    }
  });
};

server.register([
  inert, vision,
  { register: hapiSwagger, options: swaggerOptions }
]).then(() => {

  addRoutes();

  server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
  });
}).catch(error => {
  console.error('Server plugins registration failed!');
  throw error;
});