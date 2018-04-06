import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnauthorizedComponent, PageNotFoundComponent, LoggedComponent } from './core';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sessions'
    },
    {
        path: 'logged', component: LoggedComponent
    },
    {
        path: '401', component: UnauthorizedComponent
    },
    {
        path: '**', component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
