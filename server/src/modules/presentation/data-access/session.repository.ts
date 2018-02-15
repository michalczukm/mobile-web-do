import { SessionModel, ClientInfoModel } from '../models';
import { documentDatabase, Session } from '../../../data';

const sessionsDbCollection = documentDatabase.session;

function exists(sessionId: string): Promise<boolean> {
    return sessionsDbCollection.count({ _id: sessionId })
        .then(result => result > 0);
}

function create(session: SessionModel): Promise<SessionModel> {
    const { id, ...sessionDocument } = session;

    return sessionsDbCollection.create(sessionDocument).then(mapSessionToSessionModel);
}

function get(): Promise<SessionModel[]> {
    return sessionsDbCollection.find()
        .then(sessions => sessions.map(session => mapSessionToSessionModel(session)));
}

function getById(id: string): Promise<SessionModel> {
    return sessionsDbCollection.findById(id).then(mapSessionToSessionModel);
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
            $push: { clientResults: clientResult }
        }, (error, _) => error ? reject(error) : resolve());
    });
}

const mapSessionToSessionModel = (session: Session): SessionModel => {
    const { _id, ...sessionModel } = session;
    return sessionModel;
};

export default {
    exists,
    create,
    get,
    getById,
    updateFields,
    addClientResult
}
