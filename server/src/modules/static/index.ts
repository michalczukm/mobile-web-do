import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { ModuleBootstrapper } from '../../common';

const isBoomResponse = (response: Hapi.ResponseObject | Boom): response is Boom => (response as Boom).isBoom !== undefined;

export default new ModuleBootstrapper({
    routing: (server => {
        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: './presentation/dist',
                    redirectToSlash: true,
                    index: true
                }
            }
        });
        server.route({
            method: 'GET',
            path: '/admin/{param*}',
            handler: {
                directory: {
                    path: './admin/dist',
                    redirectToSlash: true,
                    index: true
                }
            }
        });
        server.route({
            method: '*',
            path: '/{param*}',
            options: {
                cors: true,
                handler: () => {
                    throw Boom.notFound('Ups!');
                }
            }
        });
        server.ext('onPostHandler', (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            const response = request.response;
            if (response && isBoomResponse(response) &&
                response.isBoom && response.output &&
                response.output.statusCode === 404) {
                return h.file('./presentation/dist/index.html');
            }
            return h.continue;
        });
    })
});
