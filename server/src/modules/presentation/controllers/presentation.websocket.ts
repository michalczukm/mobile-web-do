import { notificationBus } from '../services/notifications';
import { Subscription } from '@reactivex/rxjs';

type ClientInfo = { clientConnectionId: string, handlersToUnsubscribe: Subscription[] };

type ClientsIdsToSession = {
    [key: string]: ClientInfo[],
};

// caution - it is only in-memory storage, it will not work with multiple node instances for load-balancing
const sessions: ClientsIdsToSession = {};

export default (server: SocketIO.Server) => {
    const getSessionId = (socket: SocketIO.Socket) => socket.handshake.query['sessionId'];

    const registerClient = (socket: SocketIO.Socket) => {
        const subscription = notificationBus.presentationStateChange
            .observe()
            .subscribe(message => socket.emit('switch-slide', message));

        const clientInfo = {
            clientConnectionId: socket.id,
            handlersToUnsubscribe: [subscription]
        }

        const sessionId = getSessionId(socket);
        sessionId in sessions
            ? sessions[sessionId].push(clientInfo)
            : sessions[sessionId] = [clientInfo];
    }

    server.on('connection', (socket: SocketIO.Socket) => {
        registerClient(socket);

        socket.on('disconnect', () => {
            const sessionId = getSessionId(socket);

            sessions[sessionId]
                .find(client => client.clientConnectionId === socket.id)
                .handlersToUnsubscribe
                .forEach(sub => sub.unsubscribe());

            sessions[getSessionId(socket)] = sessions[getSessionId(socket)]
                .filter(client => client.clientConnectionId !== socket.id);
        });
    });
};
