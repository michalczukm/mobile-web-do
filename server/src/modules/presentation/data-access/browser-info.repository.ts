import {documentDatabase, Session, ClientIdentifier} from '../../../data';
import {BrowserInfoModel} from '../models';
import {logger} from '../../../common';

const browserInfoDbCollection = documentDatabase.browserInfo;
const sessionsDbCollection = documentDatabase.session;

async function add(sessionId: string, clientIdentifier: string, browserInfo: BrowserInfoModel): Promise<void> {
    try {
        await sessionsDbCollection.update({_id: sessionId}, {
            $push: {
                [((key: keyof Session) => key)('browserInfo')]: browserInfo,
                [((key: keyof Session) => key)('clientIdentifiers')]: {identifier: clientIdentifier} as ClientIdentifier
            }
        });

        await browserInfoDbCollection.create(browserInfo);
    } catch (reason) {
        logger.error(`Cannot add browser into to client: '${clientIdentifier}'`, reason);
        throw reason;
    }
}

export default {
    add
}
