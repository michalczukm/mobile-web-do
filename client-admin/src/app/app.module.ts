import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule, ENVIRONMENT_TOKEN, EnvironmentProvider, NotificationsService } from './core';
import { environment } from '../environments/environment';
// no index.ts, it will be moved to lazy loading
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
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
