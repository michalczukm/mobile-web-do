import * as Hapi from 'hapi';
import * as Joi from 'joi';

import browserInfoController from './controllers/browser-info.controller';
import sessionController from './controllers/session.controller';
import featureController from './controllers/feature.controller';

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
        method: 'PUT',
        path: '/api/sessions/{id}/feature/current',
        handler: (request, reply) => sessionController.setSlideFeature(request, reply),
        config: {
            tags: ['api', 'admin'],
            validate: {
                payload: Joi.object({
                    slideFeatureId: Joi.string().allow('').required(),
                }).required(),
                params: {
                    id: Joi.string().allow('').required()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/sessions/{id}/features',
        handler: (request, reply) => featureController.get(request, reply),
        config: {
            tags: ['api', 'admin'],
            // validate: {
            //     payload: Joi.object({
            //         sessionId: Joi.string().allow('').required()
            //     }).required(),
            //     params: {
            //         id: Joi.string().allow(null).required()
            //     }
            // }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/sessions/{id?}',
        handler: (request, reply) => request.params.id
            ? sessionController.getById(request, reply)
            : sessionController.get(request, reply),
        config: {
            tags: ['api', 'admin'],
            validate: {
                params: {
                    id: Joi.string().allow(null).optional()
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/api/sessions/{id}/state',
        handler: (request, reply) => sessionController.setState(request, reply),
        config: {
            tags: ['api', 'admin'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        }
    });
};
