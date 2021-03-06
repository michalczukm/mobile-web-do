import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvironmentProvider } from '../../core';
import { Feature } from './models';
import { SessionsModule } from '../sessions.module';

@Injectable()
export class FeatureService {
    private baseUrl: string;

    constructor(private http: HttpClient, environmentProvider: EnvironmentProvider) {
        this.baseUrl = environmentProvider.current.apiBaseUrl;
    }

    getForSession(sessionId: string): Observable<Feature[]> {
        return this.http.get<Feature[]>(`${this.baseUrl}/sessions/${sessionId}/features`);
    }
}
