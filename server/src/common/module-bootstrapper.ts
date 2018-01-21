import * as Hapi from 'hapi';
import * as io from 'socket.io';

export type ModuleConfiguration = {
    routing: (server: Hapi.Server) => void;
    webSockets?: (server: SocketIO.Server) => void;
}

export class ModuleBootstrapper {
    constructor(private configuration: ModuleConfiguration) { }

    register(server: Hapi.Server, webSocketsServer?: Hapi.Server): void {
        this.configuration.routing(server);

        if (this.configuration.webSockets && webSocketsServer) {
            const websocket = io(webSocketsServer.listener);
            this.configuration.webSockets(websocket);
        }
    }
}
