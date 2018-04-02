import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { RequestHandler } from '../../../hapi-utils';
import featureService from '../services/features';
import { FeatureWebModel } from './web-models/features';
import { validation } from '../validators';

export default {
    get: async function (request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
        const validationResult = await validation.sessionExists(request.params.id);
        return validationResult.isSuccess
            ? reply(featureService.getPresentationSet().map(item => ({
                id: item.id,
                name: item.name
            }) as FeatureWebModel))
            : reply(Boom.notFound(validationResult.errorsMessage));

    } as RequestHandler,
};
