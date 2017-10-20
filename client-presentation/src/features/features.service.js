import {
    Feature
} from './feature';

const FEATURES = [
    new Feature('home-screen', () => window.BeforeInstallPromptEvent),
    new Feature('push-notifications',
        () => !!window.PushManager,
        () => ServiceWorkerRegistration && ServiceWorkerRegistration.prototype && ServiceWorkerRegistration.prototype.showNotification,
        () => window.safari.pushNotification),
    new Feature('device-orientation',
        () => window.DeviceOrientationEvent)
];

export default {
    get: () => FEATURES
};
