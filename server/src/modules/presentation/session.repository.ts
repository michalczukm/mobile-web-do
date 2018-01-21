import { DATA } from '../data';

function exists(sessionId: string): Promise<boolean> {
    return Promise.resolve(DATA.sessions.some(session => session.id === sessionId));
}

export default {
    exists
}
