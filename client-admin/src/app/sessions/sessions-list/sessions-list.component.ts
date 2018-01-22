import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Session, SessionService } from '../shared';

@Component({
    selector: 'app-sessions-list',
    templateUrl: './sessions-list.component.html',
    styleUrls: ['./sessions-list.component.scss']
})
export class SessionsListComponent implements OnInit {
    sessions$: Observable<Session[]>;

    constructor(private sessionService: SessionService) { }

    ngOnInit(): void {
        this.sessions$ = this.sessionService.get();
    }
}
