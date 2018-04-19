import { Component } from '@angular/core';

import { Session } from '../shared';
import { ActivatedRoute } from '@angular/router';
import { SessionsListPayload } from './sessions-list-resolver';

@Component({
    selector: 'app-sessions-list',
    templateUrl: './sessions-list.component.html',
    styleUrls: ['./sessions-list.component.scss']
})
export class SessionsListComponent {
    sessions: Session[];

    constructor(private route: ActivatedRoute) {
        const payload = this.route.snapshot.data['payload'] as SessionsListPayload;
        this.sessions = payload.sessions;
    }
}
