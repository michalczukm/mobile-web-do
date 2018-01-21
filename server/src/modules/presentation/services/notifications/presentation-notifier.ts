import { Subject } from '@reactivex/rxjs';
import { Session } from '../../models';

class PresentationNotifier {
    private subject = new Subject();

    constructor() {
        console.log('PresentationNotifier created!');
    }

    public setSlide(slideFeatureId: string, session: Session): void {
        this.subject.next();
    }
}

export const presentationNotifier = new PresentationNotifier();
