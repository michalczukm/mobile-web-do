import { Feature, specificationType } from '../feature';

const exampleUsage = `// for mobile
navigator.serviceWorker.ready
    .then(registration => registration.showNotification('Notification title', {
        body: 'Mobile browsers can do notifications :)'
}));

// for desktop
new Notification('Notification title', {
    body: 'Desktop browsers can do notifications :)'
});`;

export default new Feature(
    'notifications-api',
    exampleUsage,
    () => {
        const notification = { body: 'Mobile browsers can do notifications :)' };
        const showNotificationViaNotificationApi = () =>
            new Notification('Notifications API', notification);

        if (Notification) {
            // workaround due to bug in Safari where `Notification.requestPermission()` returns undefined
            (permissionPromise => permissionPromise || Promise.resolve())(
                Notification.requestPermission(),
            ).then(() => showNotificationViaNotificationApi());
        }
        navigator.serviceWorker.ready.then(registration =>
            registration.showNotification('Notifications API', notification),
        );

        return {
            infoArray: [`Please grant permission to see the result`],
        };
    },
    { test: () => window.Notification, specification: specificationType.STANDARD },
    {
        test: () =>
            ServiceWorkerRegistration &&
            ServiceWorkerRegistration.prototype &&
            ServiceWorkerRegistration.prototype.showNotification,
        specification: specificationType.STANDARD,
    },
);
