
import { DATA } from '../data';
import { Result } from '../../common';
import { BrowserInfo, ClientIdentifier } from './models';

/**
 * For now - only in-memory storage
 */
function add(clientIdentifier: string): Promise<void> {
    DATA.clientIdentifiers.push({
        identifier: clientIdentifier,
        createdAt: new Date()
    } as ClientIdentifier);

    return Promise.resolve();
}

function existInSession(clientIdentifier: string, sessionId: string): Promise<boolean> {
    return Promise.resolve(
        !!DATA.sessions
            .find(session => session.id === sessionId)
            .clientIdentifiers
            .find(id => id.identifier === clientIdentifier));
}

export default {
    add,
    existInSession
}
