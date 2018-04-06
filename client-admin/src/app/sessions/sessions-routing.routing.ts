import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../core';
import { SessionsListComponent } from './sessions-list';
import { SessionDetailsComponent, SessionDetailsResolver } from './session-details';

const routes: Routes = [
    {
        path: 'sessions',
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: '',
                component: SessionsListComponent
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
    SessionDetailsComponent
];

export const componentsResolvers = [
    SessionDetailsResolver
];
