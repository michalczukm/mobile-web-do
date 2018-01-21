import { ModuleBootstrapper } from '../../common';
import presentationRoutes from './presentation.routes';
import presentationWebsocket from './controllers/presentation.websocket';

export default new ModuleBootstrapper({
    routing: presentationRoutes,
    webSockets: presentationWebsocket
});
