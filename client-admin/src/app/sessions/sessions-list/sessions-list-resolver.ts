import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Session, SessionService } from '../shared';
import { map } from 'rxjs/operators';

export interface SessionsListPayload {
    sessions: Session[];
}

@Injectable()
export class SessionsListResolver implements Resolve<SessionsListPayload> {
    constructor(private sessionService: SessionService) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return this.sessionService.get()
            .pipe(
                map(value => ({sessions: value} as SessionsListPayload))
            );
    }
}
