import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';

import { ModuleBootstrapper } from '../../common';

const isBoomResponse = (response: Hapi.ResponseObject | Boom.Boom): response is Boom.Boom => (response as Boom.Boom).isBoom !== undefined;

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
                    index: true,

                }
            }
        });
        server.route({
            method: '*',
            path: '/{any*}',
            options: {
                cors: true,
                handler: () => {
                    return Boom.notFound('Ups!');
                }
            }
        });
        server.ext('onPreResponse', (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
            const response = request.response;
            if (!request.path.startsWith('/api') && response && isBoomResponse(response) &&
                response.isBoom && response.output &&
                response.output.statusCode === 404) {
                if (request.path.includes('admin')) {
                    return h.file('./admin/dist/index.html');
                } else {
                    return h.file('./presentation/dist/index.html');
                }
            }
            return h.continue;
        });
    })
});
