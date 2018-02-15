import { Subject, Observable } from '@reactivex/rxjs';
import { SessionState } from '../../../../common';
import { SessionModel } from '../../models';
import { PresentationMessage } from '../../dtos/notifications';

interface NotificationPublisher<T> {
    publish(message: T): void;
}

interface NotificationListener<T> {
    observe(): Observable<T>;
}

class RxjsNotificationHandler<T> implements NotificationPublisher<T>, NotificationListener<T> {
    private readonly subject = new Subject<T>();

    observe(): Observable<T> {
        return this.subject.asObservable();
    }
    publish(message: T): void {
        this.subject.next(message);
    }
}

class NotificationBus {
    public readonly presentationStateChange = new RxjsNotificationHandler<PresentationMessage>();

    constructor() {
        console.log('NotificationBus created!');
    }
}

export const notificationBus = new NotificationBus();


class PresentationNotifier {
    public setSlideFeature(slideFeatureId: string, session: SessionModel): void {
        notificationBus.presentationStateChange.publish(
            new PresentationMessage(
                session.state,
                {
                    id: session.id,
                    name: session.name
                },
                slideFeatureId));
    }

    public setState(state: SessionState, session: SessionModel): void {
        notificationBus.presentationStateChange.publish(
            new PresentationMessage(
                state,
                {
                    id: session.id,
                    name: session.name
                },
                session.currentSlideFeatureId));
    }
}

export const presentationNotifier = new PresentationNotifier();
