import { NgModule } from '@angular/core';

import { CoreModule } from '../core';
import { routedComponents, SessionsRoutingModule, componentsResolvers } from './sessions.routing';
import { SessionService, FeatureService } from './shared';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CoreModule,
        SessionsRoutingModule,
        ReactiveFormsModule,
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
