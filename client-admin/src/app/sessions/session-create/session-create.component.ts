import { Component } from '@angular/core';
import { SessionService } from '../shared';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../core/services';
import { logger } from '../../utils';
import { Router } from '@angular/router';

export type SessionCreateForm = {
    name: AbstractControl
};

@Component({
    selector: 'mwd-session-create',
    templateUrl: './session-create.component.html',
    styleUrls: ['./session-create.component.scss']
})
export class SessionCreateComponent {
    form: FormGroup;
    typedForm: SessionCreateForm;

    constructor(private sessionService: SessionService,
                private fb: FormBuilder,
                private notificationsService: NotificationsService,
                private router: Router) {
        this.createForm();
    }

    submit(): void {
        this.sessionService.create({...this.form.value})
            .subscribe(value => {
                this.notificationsService.showSuccess(`Session "${this.typedForm.name.value}" added`);
                this.router.navigate(['/sessions', value.id]);
            }, error => {
                logger.error('Adding session failed', error);
            });
    }

    private createForm(): void {
        this.form = this.fb.group({
            name: ['', Validators.required]
        }, {
            updateOn: 'submit'
        });

        const getControl = (key: keyof SessionCreateForm) => this.form.controls[key];

        this.typedForm = {
            name: getControl('name')
        } as SessionCreateForm;
    }
}
