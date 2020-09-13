import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';

import { RequestHandler } from '../../../hapi-utils';
import featureService from '../services/features';
import { FeatureWebModel } from './web-models/features';
import { validation } from '../validators';

export default {
    get: async function (request: Hapi.Request): Promise<Hapi.Lifecycle.ReturnValueTypes> {
        const validationResult = await validation.sessionExists(request.params.id);
        return validationResult.isSuccess
            ? featureService.getPresentationSet().map(item => ({
                id: item.id,
                name: item.name
            }) as FeatureWebModel)
            : Boom.notFound(validationResult.errorsMessage);

    } as RequestHandler,
};
