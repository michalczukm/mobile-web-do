import browserInfoRepository from '../browser-info.repository';

export default {
    create: (request, reply) => {
        const newInfo = {
            info: request.payload
        }

        return browserInfoRepository.create(newInfo)
            .then(result => result.isSuccess ? reply().code(200) : reply().code(500))
            .catch(reason => reply(reason).code(500));
    }
};
