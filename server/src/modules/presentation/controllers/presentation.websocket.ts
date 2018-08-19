import { Subscription } from '@reactivex/rxjs';
import { logger } from '../../../common';
import { sessionRepository } from '../data-access';
import { notificationBus } from '../services/notifications';
import { PresentationMessage } from '../dtos/notifications';

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
            .filter(message => message.session.id === getSessionId(socket))
            .subscribe(message => socket.emit('switch-slide', message));

        const clientInfo = {
            clientConnectionId: socket.id,
            handlersToUnsubscribe: [subscription]
        };

        const sessionId = getSessionId(socket);
        sessionId in sessions
            ? sessions[sessionId].push(clientInfo)
            : sessions[sessionId] = [clientInfo];
    };

    server.on('connection', (socket: SocketIO.Socket) => {
        registerClient(socket);

        const sessionId = getSessionId(socket);
        sessionRepository.getById(sessionId)
            .then(session => {
                if (!!session) {
                    return session;
                } else {
                    throw new Error(`Session id:'${sessionId}' doesn't exist`);
                }
            })
            .then(session => socket.emit('switch-slide',
                new PresentationMessage(session.state, { id: session.id, name: session.name }, session.currentSlideFeatureId)
            ))
            .catch(reason => logger.error('Cannot get presentation session at WS connection open.', reason));

        socket.on('disconnect', () => {
            const clientSession = sessions[getSessionId(socket)]
                .find(client => client.clientConnectionId === socket.id);

            if (!clientSession) {
                logger.error(`WS client for sessionId: ${getSessionId(socket)}, was not found.`, {});
                return;
            }

            clientSession
                .handlersToUnsubscribe
                .forEach(sub => sub.unsubscribe());

            sessions[getSessionId(socket)] = sessions[getSessionId(socket)]
                .filter(client => client.clientConnectionId !== socket.id);
        });
    });
};
