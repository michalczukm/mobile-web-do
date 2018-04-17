import * as Hapi from 'hapi';
import * as Joi from 'joi';

import browserInfoController from './controllers/browser-info.controller';
import sessionController from './controllers/session.controller';
import featureController from './controllers/feature.controller';
import resultController from './controllers/result.controller';

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
                        'ServiceWorker.prototype': Joi.object().allow(null).optional(),
                        'ServiceWorkerRegistration.prototype': Joi.object().allow(null).optional()
                    }),
                    sessionId: Joi.string().allow('').required()
                }).required()
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/sessions/{id}/results',
        handler: (request, reply) => resultController.getForSession(request, reply),
        config: {
            tags: ['api', 'presentation'],
            validate: {
                params: {
                    id: Joi.string().required()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/sessions/{id}/results',
        handler: (request, reply) => sessionController.addResults(request, reply),
        config: {
            tags: ['api', 'presentation'],
            validate: {
                payload: Joi.array().items(
                    Joi.object({
                            featureId: Joi.string().required(),
                            status: Joi.string().required()
                        }).min(1).required()
                ),
                params: {
                    id: Joi.string().required()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/api/sessions/{id?}',
        handler: (request, reply) => request.params.id
            ? sessionController.getById(request, reply)
            : sessionController.get(request, reply),
        config: {
            tags: ['api', 'presentation', 'admin'],
            auth: {
                scope: 'crud:sessions'
            },
            validate: {
                params: {
                    id: Joi.string().allow(null).optional()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/api/sessions',
        handler: (request, reply) => sessionController.create(request, reply),
        config: {
            tags: ['api', 'admin'],
            auth: {
                scope: 'crud:sessions'
            },
            validate: {
                payload: Joi.object({
                    name: Joi.string().required()
                }).required()
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/api/sessions/{id}/features/current',
        handler: (request, reply) => sessionController.setSlideFeature(request, reply),
        config: {
            tags: ['api', 'admin'],
            auth: {
                scope: 'crud:sessions'
            },
            validate: {
                payload: Joi.object({
                    slideFeatureId: Joi.string().required(),
                }).required(),
                params: {
                    id: Joi.string().required()
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
            auth: {
                scope: 'crud:sessions'
            },
            validate: {
                params: {
                    id: Joi.string().required()
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
            auth: {
                scope: 'crud:sessions'
            },
            validate: {
                payload: Joi.object({
                    state: Joi.string().required()
                }),
                params: {
                    id: Joi.string().required()
                }
            }
        }
    });
};
