import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { Session, SessionService } from '../shared';

export interface SessionDetailsPayload {
    session: Session;
}

@Injectable()
export class SessionDetailsResolver implements Resolve<SessionDetailsPayload> {
    constructor(private sessionService: SessionService) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        const sessionId = route.paramMap.get('id');
        return this.sessionService.getById(sessionId)
            .pipe(map(session => ({ session: session } as SessionDetailsPayload)));
    }
}
