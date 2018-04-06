import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule, ENVIRONMENT_TOKEN, EnvironmentProvider, NotificationsService, AUTH_CONFIG_TOKEN } from './core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authConfig, environment } from '../environments/environment';

import { SessionsModule } from './sessions/sessions.module';

@NgModule({
    imports: [
        BrowserModule,
        CoreModule,
        SessionsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        EnvironmentProvider,
        NotificationsService,
        {
            provide: ENVIRONMENT_TOKEN,
            useValue: environment
        },
        {
            provide: AUTH_CONFIG_TOKEN,
            useValue: authConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
