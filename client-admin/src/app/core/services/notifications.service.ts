import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class NotificationsService {

    constructor(private toastr: ToastrService) {
    }

    showSuccess(message?: string, title?: string): void {
        this.toastr.success(message, title || 'Success');
    }

    showError(message: string | Object, title?: string): void {
        const content = typeof message === 'object' ? JSON.stringify(message) : message;

        this.toastr.error(content, title || 'Ups');
    }
}
