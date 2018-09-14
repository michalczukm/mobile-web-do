import * as Hapi from 'hapi';
const sanitize = require('mongo-sanitize');

export type RequestHandler = (request: Hapi.Request, reply?: Hapi.ResponseToolkit) => Promise<Hapi.Lifecycle.ReturnValueTypes>;

export const getPayload = <T = object>(request: Hapi.Request): T => sanitize(request.payload);
