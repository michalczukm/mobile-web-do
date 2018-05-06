import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { Session, SessionService, Feature } from '../shared';
import { FeatureService } from '../shared/feature.service';

export interface SessionDetailsPayload {
    session: Session;
    features: Feature[];
}

@Injectable()
export class SessionDetailsResolver implements Resolve<SessionDetailsPayload> {
    constructor(private sessionService: SessionService,
        private featureService: FeatureService) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const sessionId = route.paramMap.get('id');

        if (!sessionId) {
            throw new Error('No session id provided');
        }

        return forkJoin([
            this.featureService.getForSession(sessionId),
            this.sessionService.getById(sessionId)
        ])
            .pipe(map((data: Array<Feature[] | Session>) => ({
                features: data[0],
                session: data[1]
            } as SessionDetailsPayload)));
    }
}
