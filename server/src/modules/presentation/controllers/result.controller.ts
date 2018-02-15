import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { sessionRepository } from '../data-access';
import { ClientInfoModel, ClientSessionResults } from '../models';
import { SessionResultsWebModel, SystemStatisticWebMode } from './web-models/results';
import { RequestHandler } from '../../../hapi-utils';
import { SupportStatus } from '../../../common';

const groupBy = (list: Object[], selector: (ref: Object) => any): Map<any, Object[]> => {
    const map = new Map();
    list.forEach((item) => {
        const key = selector(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function getForSession(request: Hapi.Request, reply: Hapi.ReplyNoContinue): Promise<Hapi.Response> {
    const sessionId = request.params.id;

    return sessionRepository.getById(sessionId)
        .then(session => {
            if (!session) {
                return reply(Boom.badRequest(`Session at id: "${sessionId}", doesn't exist`));
            }

            const browsers = [] as SystemStatisticWebMode[];
            groupBy(session.clientResults, (result: ClientInfoModel) => result.browser.family)
                .forEach((value: ClientInfoModel[], key: string) => browsers.push({ family: key, quantity: value.length }));

            const systems = [] as SystemStatisticWebMode[];
            groupBy(session.clientResults, (result: ClientInfoModel) => result.system.family)
                .forEach((value: ClientInfoModel[], key: string) => systems.push({ family: key, quantity: value.length }));

            const results = [] as {
                featureId: string,
                statuses: SupportStatus[]
            }[];
            groupBy(session.clientResults.reduce((acc, curr) => acc.concat(curr.clientResults), []),
                (result: ClientSessionResults) => result.featureId
            )
                .forEach((value: ClientSessionResults[], key: string) =>
                    results.push({ featureId: key, statuses: value.map(r => r.status) }))

            const webModel: SessionResultsWebModel = {
                clientsQuantity: session.clientIdentifiers.length,
                browsers: browsers,
                systems: systems,
                results: results
            }

            return reply(webModel).code(200);
        });
}

export default {
    getForSession: <RequestHandler>getForSession
};
