import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth';

@Component({
    selector: 'mwd-logged',
    templateUrl: './logged.component.html',
    styleUrls: ['./logged.component.scss']
})
export class LoggedComponent implements OnInit {

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.handleAuthentication();
    }
}
