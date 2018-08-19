import { SessionModel, ClientInfoModel, CreateSessionModel } from '../models';
import { documentDatabase, Session } from '../../../data';
import { logger, NullEntityError } from '../../../common';
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

function create(session: CreateSessionModel | SessionModel): Promise<SessionModel> {
    const { ...sessionDocument } = session;
    // @ts-ignore
    delete sessionDocument['id'];

    return sessionsDbCollection.create({ ...sessionDocument }).then(mapSessionToSessionModel)
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

const mapSessionToSessionModel = (session: Session | null): SessionModel => {
    if (!session) {
        throw new NullEntityError(
            'Session cannot be null here. Probably data consistency was violated, or problems with creating occurred'
        );
    }

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
