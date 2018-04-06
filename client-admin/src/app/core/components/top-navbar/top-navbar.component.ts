import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth';

@Component({
    selector: 'app-top-navbar',
    templateUrl: './top-navbar.component.html',
    styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit, OnDestroy {
    subscriptions = [] as Subscription[];

    isAuthenticated: boolean;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.authService.isAuthenticated$.subscribe(value => this.isAuthenticated = value)
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(value => value.unsubscribe());
    }

    login(): void {
        this.authService.login();
    }

    logout(): void {
        this.authService.logout();
    }
}
