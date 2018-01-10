import * as Hapi from 'hapi';
import * as Joi from 'joi';

import browserInfoController from './controllers/browser-info.controller';

export default (server: Hapi.Server) => {
    server.route({
        method: 'POST',
        path: '/api/browser-info',
        handler: (request, reply) => browserInfoController.create(request, reply),
        config: {
            tags: ['api', 'presentation'],
            validate: {
                payload: Joi.object({
                    browserInfo: Joi.object({
                        navigator: Joi.object().required(),
                        window: Joi.object().required(),
                        'Navigator.prototype': Joi.object(),
                        'Window.prototype': Joi.object(),
                        'ServiceWorker.prototype': Joi.object(),
                        'ServiceWorkerRegistration.prototype': Joi.object()
                    }),
                    sessionId: Joi.string().allow('').optional()
                }).required()
            }
        }
    })
};
