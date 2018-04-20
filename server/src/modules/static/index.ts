import { ModuleBootstrapper } from '../../common';

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
        server.ext('onPostHandler', (request, reply) => {
            const response = request.response;
            if (response.isBoom && response.output.statusCode === 404) {
                return reply.file('./admin/dist/index.html');
            }
            return reply.continue();
        });
    })
});
