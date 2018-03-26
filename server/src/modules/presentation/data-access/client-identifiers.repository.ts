
import { documentDatabase, ClientIdentifier } from '../../../data';
import { Result, logger } from '../../../common';
import { BrowserInfoModel, ClientIdentifierModel } from '../models';

const clientIdentifierDbCollection = documentDatabase.clientIdentifier;
const sessionsDbCollection = documentDatabase.session;

function add(clientIdentifier: string): Promise<ClientIdentifierModel> {
    return clientIdentifierDbCollection.create({identifier: clientIdentifier} as ClientIdentifier)
        .then((identifier: ClientIdentifier) => identifier as ClientIdentifierModel)
        .catch(reason => {
            logger.error(`Cannot create client identifier for identifier: '${clientIdentifier}'`, reason);
            throw reason;
        });

    // DATA.clientIdentifiers.push({
    //     identifier: clientIdentifier,
    //     createdAt: new Date()
    // } as ClientIdentifierModel);

    // return Promise.resolve();
}

function existInSession(clientIdentifier: string, sessionId: string): Promise<boolean> {
    return sessionsDbCollection
        .findById(sessionId)
        .count({
            'clientIdentifiers.identifier': clientIdentifier
        })
        .then(count => !!count);

    // return Promise.resolve(
    //     !!DATA.sessions
    //         .find(session => session.id === sessionId)
    //         .clientIdentifiers
    //         .find(id => id.identifier === clientIdentifier));
}

function existInSessionResults(clientIdentifier: string, sessionId: string): Promise<boolean> {
    return sessionsDbCollection
        .findById(sessionId)
        .count({
            'clientResults.clientIdentifier': clientIdentifier
        })
        .then(count => !!count);
    // return Promise.resolve(
    //     !!DATA.sessions
    //         .find(session => session.id === sessionId)
    //         .clientResults
    //         .find(result => result. === clientIdentifier));
}

export default {
    add,
    existInSession,
    existInSessionResults
}
