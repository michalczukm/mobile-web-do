import * as Hapi from 'hapi';

export type RequestHandler = (request: Hapi.Request, reply?: Hapi.ResponseToolkit) => Promise<Hapi.Lifecycle.ReturnValueTypes>;
