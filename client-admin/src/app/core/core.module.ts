import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { LoggedComponent, PageNotFoundComponent, TopNavbarComponent, UnauthorizedComponent } from './components';
import { AuthService, AuthGuard } from './auth';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
    ],
    declarations: [
        PageNotFoundComponent,
        LoggedComponent,
        TopNavbarComponent,
        UnauthorizedComponent
    ],
    providers: [
        AuthService,
        AuthGuard
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
