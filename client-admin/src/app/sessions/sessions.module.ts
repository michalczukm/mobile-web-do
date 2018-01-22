import { NgModule } from '@angular/core';

import { CoreModule } from '../core';
import { routedComponents, SessionsRoutingModule, componentsResolvers } from './sessions-routing.routing';
import { SessionService, FeatureService } from './shared';

@NgModule({
    imports: [
        CoreModule,
        SessionsRoutingModule
    ],
    declarations: [
        routedComponents
    ],
    providers: [
        componentsResolvers,
        SessionService,
        FeatureService
    ]
})
export class SessionsModule { }
