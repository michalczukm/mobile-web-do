import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NotificationsService } from '../../core';
import { SessionService, Session, SessionState } from '../shared';
import { SessionDetailsPayload } from './session-details.resolver';

@Component({
    selector: 'app-session-details',
    templateUrl: './session-details.component.html',
    styleUrls: ['./session-details.component.scss']
})
export class SessionDetailsComponent implements OnInit {
    session: Session;
    availableStates = Object.values(SessionState);

    constructor(private route: ActivatedRoute,
        private sessionService: SessionService,
        private notificationsService: NotificationsService) {
    }

    ngOnInit(): void {
        const payload = this.route.snapshot.data['payload'] as SessionDetailsPayload;
        this.session = payload.session;
    }

    setState(state: SessionState): void {
        this.sessionService.setState(this.session.id, state)
            .subscribe(
            () => this.notificationsService.showSuccess(),
            error => this.notificationsService.showError(error));
    }
}
