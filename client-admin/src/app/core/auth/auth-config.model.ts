import { InjectionToken } from '@angular/core';

export interface AuthConfig {
    clientID: string;
    domain: string;
    callbackURL: string;
}

export const AUTH_CONFIG_TOKEN = new InjectionToken<AuthConfig>('auth-config');
