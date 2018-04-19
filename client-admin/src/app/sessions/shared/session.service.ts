import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Session, Feature } from './models';
import { EnvironmentProvider } from '../../core';
import { SessionState } from './models';
import { map } from 'rxjs/operators';

@Injectable()
export class SessionService {
    private baseUrl: string;

    constructor(private http: HttpClient, environmentProvider: EnvironmentProvider) {
        this.baseUrl = environmentProvider.current.apiBaseUrl;
    }

    get(): Observable<Session[]> {
        return this.http.get<Session[]>(this.buildUrl('sessions'));
    }

    getById(id: string): Observable<Session> {
        return this.http.get<Session>(this.buildUrl(`sessions/${id}`));
    }

    setState(sessionId: string, state: SessionState): Observable<Object | void> {
        return this.http.put(this.buildUrl(`sessions/${sessionId}/state`), {
            state: state
        });
    }

    setFeature(sessionId: string, feature: Feature): Observable<Object | void> {
        return this.http.put(this.buildUrl(`sessions/${sessionId}/features/current`), {
            slideFeatureId: feature.id
        });
    }

    create(session: Session): Observable<Session> {
        return this.http.post<Session>(this.buildUrl(`sessions`), session, { observe: 'body'});
    }

    private buildUrl = (url: string) => `${this.baseUrl}/${url}`;
}
