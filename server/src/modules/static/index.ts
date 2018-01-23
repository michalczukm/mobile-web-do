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
        })
    })
});
