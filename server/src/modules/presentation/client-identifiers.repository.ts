
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

function contains(clientIdentifier: string): Promise<boolean> {
    const xyt = DATA.clientIdentifiers;
    return Promise.resolve(!!DATA.clientIdentifiers.find(id => id.identifier === clientIdentifier));
}

export default {
    add,
    contains
}
