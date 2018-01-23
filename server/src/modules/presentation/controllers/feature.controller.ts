import * as Hapi from 'hapi';

import { RequestHandler } from '../../../hapi-utils';
import featureService from '../services/features';
import { FeatureWebModel } from './web-models/features';

export default {
    get: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const features = featureService.getPresentationSet().map(item => ({
            id: item.id,
            name: item.name
        }) as FeatureWebModel);

        return Promise.resolve(reply(features));
    }) as RequestHandler,
};
