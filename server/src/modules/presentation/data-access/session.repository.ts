import { SessionModel, ClientInfoModel } from '../models';
import { documentDatabase, Session } from '../../../data';
import { logger } from '../../../common';
import { isIdValid } from './validation/mongoose-basic.validation';

const sessionsDbCollection = documentDatabase.session;

async function exists(sessionId: string): Promise<boolean> {
    if (isIdValid(sessionId)) {
        const count = await sessionsDbCollection.count({ _id: sessionId });
        return count > 0;
    } else {
        return false;
    }
}

function create(session: SessionModel): Promise<SessionModel> {
    const { id, ...sessionDocument } = session;

    return sessionsDbCollection.create(sessionDocument).then(mapSessionToSessionModel)
        .catch(reason => {
            logger.error(`Cannot create session for name: '${session.name}'`, reason);
            throw reason;
        });
}

function get(): Promise<SessionModel[]> {
    return sessionsDbCollection.find().exec()
        .then(sessions => sessions.map(session => mapSessionToSessionModel(session)));
}

async function getById(id: string): Promise<SessionModel | null> {
    return isIdValid(id) ? sessionsDbCollection.findById(id).exec().then(mapSessionToSessionModel) : null;
}

function updateFields(sessionId: string, modifyFields: { [key in keyof SessionModel]: any }): Promise<void> {
    return new Promise((resolve, reject) => {
        sessionsDbCollection.update({ _id: sessionId }, {
            $set: modifyFields,
        }, (error, _) => error ? reject(error) : resolve());
    });
}

function addClientResult(sessionId: string, clientResult: ClientInfoModel): Promise<void> {
    return new Promise((resolve, reject) => {
        sessionsDbCollection.update({ _id: sessionId }, {
            $push: { [((key: keyof Session) => key)('clientResults')]: clientResult }
        }, (error, _) => error ? reject(error) : resolve());
    });
}

const mapSessionToSessionModel = (session: Session): SessionModel => {
    return session;
};

export default {
    exists,
    create,
    get,
    getById,
    updateFields,
    addClientResult
}
