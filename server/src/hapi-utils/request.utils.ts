import * as Hapi from 'hapi';

export type RequestHandler = (request: Hapi.Request, reply: Hapi.ReplyNoContinue) => Promise<Hapi.Response>;