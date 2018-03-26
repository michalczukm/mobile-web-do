import { documentDatabase, Session, ClientIdentifier } from '../../../data';
import { DATA } from '../../data';
import { BrowserInfoModel } from '../models';
import { logger } from '../../../common';

const clientIdentifierDbCollection = documentDatabase.clientIdentifier;
const sessionsDbCollection = documentDatabase.session;

function add(sessionId: string, clientIdentifier: string, browserInfo: BrowserInfoModel): Promise<void> {
    return Promise.sessionsDbCollection.update({_id: sessionId}, {
        $push: {
            [((key: keyof Session) => key)('browserInfo')]: browserInfo,
            [((key: keyof Session) => key)('browserInfo')]: { identifier: clientIdentifier } as ClientIdentifier
        }
    })
    .catch(reason => {
        logger.error(`Cannot add browser into to client: '${clientIdentifier}'`, reason);
        throw reason;
    });


    // const session = DATA.sessions.find(s => s.id === sessionId);
    // session.browserInfo.push(browserInfo);
    // session.clientIdentifiers.push({ identifier: clientIdentifier, createdAt: new Date() });

    // DATA.browserInfo.push(browserInfo);
    // return Promise.resolve();
}

export default {
    add
}
