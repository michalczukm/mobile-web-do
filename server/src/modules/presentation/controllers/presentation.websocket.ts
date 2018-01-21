import { presentationNotifier } from '../services/notifications';

// type ClientPerSession = {
//     [clientId: string],
//     sessionId: string
// };

// const sessions = [] as ClientPerSession[];

export default (server: SocketIO.Server) => {
    server.on('connection', (socket: SocketIO.Socket) => {
        // socket.on('switch-slide', message => messageSubject.next(message))
        // messageSubject.subscribe(message => socket.emit('switch-slide', message));
        presentationNotifier.subscribe();
    });
    server.on('disconnect', () => console.log(`client disconnected`));
};
