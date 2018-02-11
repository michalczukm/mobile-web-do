import { DATA } from '../../data';
import { Session } from '../models';

function exists(sessionId: string): Promise<boolean> {
    return Promise.resolve(DATA.sessions.some(session => session.id === sessionId));
}

function create(session: Session): Promise<void> {
    DATA.sessions.push(session);
    return Promise.resolve();
}

function get(): Promise<Session[]> {
    return Promise.resolve(DATA.sessions);
}

function getById(id: string): Promise<Session> {
    return Promise.resolve(DATA.sessions.find(session => session.id === id));
}

function update(session: Session): Promise<void> {
    const indexToUpdate = DATA.sessions.findIndex(s => s.id === session.id);
    DATA.sessions[indexToUpdate] = session;

    return Promise.resolve();
}

export default {
    exists,
    create,
    get,
    getById,
    update
}
