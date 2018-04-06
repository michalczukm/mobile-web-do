import { InjectionToken, Injectable, Inject } from '@angular/core';

export const ENVIRONMENT_TOKEN = new InjectionToken<Environment>('environment');

export interface Environment {
    production: boolean;
    apiBaseUrl: string;
}

@Injectable()
export class EnvironmentProvider {
    constructor(@Inject(ENVIRONMENT_TOKEN) private environment: Environment) {
    }

    get current(): Environment {
        return {...this.environment};
    }
}
