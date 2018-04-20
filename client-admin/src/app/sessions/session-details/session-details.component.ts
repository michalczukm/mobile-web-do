import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NotificationsService } from '../../core';
import { SessionService, Session, SessionState, Feature } from '../shared';
import { SessionDetailsPayload } from './session-details.resolver';

@Component({
    selector: 'mwd-session-details',
    templateUrl: './session-details.component.html',
    styleUrls: ['./session-details.component.scss']
})
export class SessionDetailsComponent implements OnInit {
    features: Feature[];
    session: Session;
    availableStates = Object.values(SessionState);

    constructor(private route: ActivatedRoute,
        private sessionService: SessionService,
        private notificationsService: NotificationsService) {
    }

    ngOnInit(): void {
        const payload = this.route.snapshot.data['payload'] as SessionDetailsPayload;
        this.session = payload.session;
        this.features = payload.features;
    }

    setState(state: SessionState): void {
        this.sessionService.setState(this.session.id, state)
            .subscribe(
            () => {
                this.notificationsService.showSuccess('Session updated');
                this.refreshSession();
            },
            error => this.notificationsService.showError(error));
    }

    setFeature(feature: Feature): void {
        this.sessionService.setFeature(this.session.id, feature)
        .subscribe(
            () => {
                this.notificationsService.showSuccess('Session updated');
                this.refreshSession();
            },
            error => this.notificationsService.showError(error));
    }

    private refreshSession = () => this.sessionService.getById(this.session.id)
        .subscribe(session => this.session = session)
}
