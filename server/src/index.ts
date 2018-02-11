import * as Hapi from 'hapi';
import startServer from './server';

startServer(new Hapi.Server());
