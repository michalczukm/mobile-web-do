import { documentDatabase, ClientIdentifier } from '../../../data';
import { logger } from '../../../common';
import { ClientIdentifierModel } from '../models';

const clientIdentifierDbCollection = documentDatabase.clientIdentifier;
const sessionsDbCollection = documentDatabase.session;

function add(clientIdentifier: string): Promise<ClientIdentifierModel> {
    return clientIdentifierDbCollection.create({identifier: clientIdentifier} as ClientIdentifier)
        .then((identifier: ClientIdentifier) => identifier as ClientIdentifierModel)
        .catch(reason => {
            logger.error(`Cannot create client identifier for identifier: '${clientIdentifier}'`, reason);
            throw reason;
        });
}

function existInSession(clientIdentifier: string, sessionId: string): Promise<boolean> {
    return sessionsDbCollection
        .findById(sessionId)
        .count({
            'clientIdentifiers.identifier': clientIdentifier
        })
        .then(count => !!count);
}

function existInSessionResults(clientIdentifier: string, sessionId: string): Promise<boolean> {
    return sessionsDbCollection
        .findById(sessionId)
        .count({
            'clientResults.clientIdentifier': clientIdentifier
        })
        .then(count => !!count);
}

export default {
    add,
    existInSession,
    existInSessionResults
}
