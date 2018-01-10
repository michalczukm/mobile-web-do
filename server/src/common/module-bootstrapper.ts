import * as Hapi from 'hapi';
import { Server } from 'hapi';

export type ModuleConfiguration = {
    routing: (server: Hapi.Server) => void;
}

export class ModuleBootstrapper {
    constructor(private configuration: ModuleConfiguration) { }

    register(server: Hapi.Server) {
        this.configuration.routing(server);
    }
}
