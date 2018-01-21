import * as Hapi from 'hapi';
import * as Joi from 'joi';

import browserInfoController from './controllers/browser-info.controller';
import sessionController from './controllers/session.controller';

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
    });

    server.route({
        method: 'POST',
        path: '/api/sessions',
        handler: (request, reply) => sessionController.create(request, reply),
        config: {
            tags: ['api', 'admin'],
            validate: {
                payload: Joi.object({
                    name: Joi.string().allow('').required()
                }).required()
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/sessions/set-feature-slide',
        handler: (request, reply) => sessionController.setSlideFeature(request, reply),
        config: {
            tags: ['api', 'admin'],
            validate: {
                payload: Joi.object({
                    sessionId: Joi.string().allow('').required(),
                    slideFeatureId: Joi.string().allow('').required()
                }).required()
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/sessions',
        handler: (request, reply) => sessionController.get(request, reply),
        config: {
            tags: ['api', 'admin']
        }
    })
};
