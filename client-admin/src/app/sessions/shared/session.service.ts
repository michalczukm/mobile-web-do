import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Session } from './models';
import { EnvironmentProvider } from '../../core';
import { SessionState } from './models';

@Injectable()
export class SessionService {
    private baseUrl: string;

    constructor(private http: HttpClient, environmentProvider: EnvironmentProvider) {
        this.baseUrl = environmentProvider.current.apiBaseUrl;
    }

    get(): Observable<Session[]> {
        return this.http.get<Session[]>(`${this.baseUrl}/sessions`);
    }

    getById(id: string): Observable<Session> {
        return this.http.get<Session>(`${this.baseUrl}/sessions/${id}`);
    }

    setState(sessionId: string, state: SessionState): Observable<Object | void> {
        return this.http.put(`${this.baseUrl}/sessions/${sessionId}/state`, {
            state: state
        });
    }

    // get available slides list
    // set slide
}
