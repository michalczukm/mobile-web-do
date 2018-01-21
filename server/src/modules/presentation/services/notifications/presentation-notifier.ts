import { Subject } from '@reactivex/rxjs';
import { Session } from '../../models';
import { Observable } from '@reactivex/rxjs/dist/package/Observable';
import { PresentationMessage } from '../../dtos/notifications';

class PresentationNotifier {
    private subject = new Subject<PresentationMessage>();

    constructor() {
        console.log('PresentationNotifier created!');
    }

    public setSlide(slideFeatureId: string, session: Session): void {
        this.subject.next(
            new PresentationMessage(
                session.state,
                {
                    id: session.id,
                    name: session.name
                },
                slideFeatureId));
    }

    public subscribe(): Observable<PresentationMessage> {
        return this.subject.asObservable();
    }
}

export const presentationNotifier = new PresentationNotifier();
