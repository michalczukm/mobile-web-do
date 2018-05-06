import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { Observable, BehaviorSubject } from 'rxjs';
import { AUTH_CONFIG_TOKEN, AuthConfig } from './auth-config.model';
import { logger } from '../../utils';

@Injectable()
export class AuthService {
    private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(this.isAuthenticated());

    private readonly auth0 = new auth0.WebAuth({
        clientID: this.authConfig.clientID,
        domain: this.authConfig.domain,
        responseType: 'token id_token',
        audience: `/admin`,
        redirectUri: this.authConfig.callbackURL,
        scope: 'openid crud:sessions'
    });

    isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject$.asObservable();

    constructor(private router: Router, @Inject(AUTH_CONFIG_TOKEN) private authConfig: AuthConfig) {
    }

    login(): void {
        this.auth0.authorize();
    }

    logout(): void {
        ['access_token', 'id_token', 'expires_at'].forEach(item => localStorage.removeItem(item));
        this.router.navigate(['/']);
        this.updateAuthenticatedState();
    }

    handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
            } else if (err) {
                logger.error(`Auth0 authorization failed: ${err.error}.`, err);
            }

            this.updateAuthenticatedState();
            this.router.navigate(['/']);
        });
    }

    private updateAuthenticatedState = (): void => this.isAuthenticatedSubject$.next(this.isAuthenticated());

    private isAuthenticated(): boolean {
        const tokenExpireDate = localStorage.getItem('expires_at');

        if (tokenExpireDate) {
            const expiresAt = JSON.parse(tokenExpireDate);
            return new Date().getTime() < expiresAt;
        } else {
            return false;
        }
    }

    private setSession(authResult: auth0.Auth0DecodedHash): void {
        const expiresAt = JSON.stringify(((authResult.expiresIn || 0) * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken || '');
        localStorage.setItem('id_token', authResult.idToken || '');
        localStorage.setItem('expires_at', expiresAt);
    }
}
