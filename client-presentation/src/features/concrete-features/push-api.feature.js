import { Feature, specificationType } from '../feature';

const exampleUsage = `
// ===== 0. Have service worker and HTTPS

// ===== 1. register service worker
function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js');
}

// ===== 2. Request for permission
Notification.requestPermission().then(...) ...

// ===== 3. Subscribe for server push messages
navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
        const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: ...
    };

    return registration.pushManager.subscribe(subscribeOptions);
})
.then((pushSubscription) => {
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return pushSubscription;
});

// ===== 4. Subscribe for messages
self.addEventListener('push', e => {
    e.waitUntil(
        self.registration.showNotification('Hello world!', {
            body: e
        })
    );
});
`;

export default new Feature(
    'push-api',
    exampleUsage,
    () => ({ infoArray: ['No server PUSH example provide. You have to trust me :)'] }),
    { test: () => window.PushManager, specification: specificationType.STANDARD },
    { test: () => window.safari.pushNotification, specification: specificationType.VENDOR },
);
