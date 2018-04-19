import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../core';
import { SessionsListComponent, SessionsListResolver } from './sessions-list';
import { SessionDetailsComponent, SessionDetailsResolver } from './session-details';
import { SessionCreateComponent } from './session-create';

const routes: Routes = [
    {
        path: 'sessions',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: '',
                component: SessionsListComponent,
                resolve: {
                    payload: SessionsListResolver
                }
            },
            {
                path: 'create',
                component: SessionCreateComponent
            },
            {
                path: ':id',
                component: SessionDetailsComponent,
                resolve: {
                    payload: SessionDetailsResolver
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SessionsRoutingModule {
}

export const routedComponents = [
    SessionsListComponent,
    SessionDetailsComponent,
    SessionCreateComponent
];

export const componentsResolvers = [
    SessionDetailsResolver,
    SessionsListResolver
];
