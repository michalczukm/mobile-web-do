import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { sessionRepository } from '../data-access';
import { ClientInfoModel, ClientSessionResults, VersionInfo } from '../models';
import { SystemStatisticWebMode } from './web-models/results';
import { RequestHandler } from '../../../hapi-utils';
import { SupportStatus } from '../../../common/enums';

const groupBy = <T>(list: T[], selector: (ref: T) => any): Map<any, T[]> => {
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
};

async function getForSession(
  request: Hapi.Request
): Promise<Hapi.Lifecycle.ReturnValueTypes> {
  const sessionId = request.params.id;

  const session = await sessionRepository.getById(sessionId);
  if (!session) {
    throw Boom.badRequest(`Session at id: "${sessionId}", doesn't exist`);
  }

  const browsers = [] as SystemStatisticWebMode[];
  groupBy(
    session.clientResults,
    (result: ClientInfoModel) => result.browser.family
  ).forEach((value: ClientInfoModel[], key: string) =>
    browsers.push({ family: key, quantity: value.length })
  );

  const systems = [] as SystemStatisticWebMode[];
  groupBy(
    session.clientResults,
    (result: ClientInfoModel) => result.system.family
  ).forEach((value: ClientInfoModel[], key: string) =>
    systems.push({ family: key, quantity: value.length })
  );

  const results = [] as {
    featureId: string;
    statuses: {
      status: SupportStatus;
      system: VersionInfo;
      browser: VersionInfo;
    }[];
  }[];

  type IntermediateResult = {
    results: ClientSessionResults;
    system: VersionInfo;
    browser: VersionInfo;
  };

  groupBy(
    session.clientResults.reduce(
      (acc: IntermediateResult[], curr: ClientInfoModel) =>
        acc.concat(
          curr.clientResults.map((results) => ({
            results: results,
            system: curr.system,
            browser: curr.browser,
          }))
        ),
      []
    ),
    (result: IntermediateResult) => result.results.featureId
  ).forEach((value: IntermediateResult[], key: string) =>
    results.push({
      featureId: key,
      statuses: value.map((r) => ({
        status: r.results.status,
        browser: r.browser,
        system: r.system,
      })),
    })
  );

  return {
    clientsQuantity: session.clientIdentifiers.length,
    browsers: browsers,
    systems: systems,
    results: results,
  };
}

export default {
  getForSession: <RequestHandler>getForSession,
};
