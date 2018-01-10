import * as Hapi from 'hapi';
import browserInfoRepository from '../browser-info.repository';
import { Result } from '../../../common';
import { RequestHandler } from '../../../hapi-utils';

export default {
    create: ((request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> => {
        const newInfo = {
            info: request.payload
        }

        return browserInfoRepository.create(newInfo)
            .then(result => result.isSuccess ? reply().code(200) : reply().code(500))
            .catch(reason => reply(reason).code(500));
    }) as RequestHandler
};
