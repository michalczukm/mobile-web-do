import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';

import { LoggedComponent, PageNotFoundComponent, TopNavbarComponent, UnauthorizedComponent } from './components';
import { AuthService, AuthGuard, UnauthorizedInterceptor } from './auth';
import { authConfig } from '../../environments/environment';

export function tokenGetter(): string {
    return localStorage.getItem('access_token');
}

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: authConfig.whitelistedDomains,
                throwNoTokenError: true
            }
        })
    ],
    declarations: [
        PageNotFoundComponent,
        LoggedComponent,
        TopNavbarComponent,
        UnauthorizedComponent
    ],
    providers: [
        AuthService,
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UnauthorizedInterceptor,
            multi: true
        }
    ],
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        PageNotFoundComponent,
        LoggedComponent,
        TopNavbarComponent,
        UnauthorizedComponent
    ],
})
export class CoreModule {
}
