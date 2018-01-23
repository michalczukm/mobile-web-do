import {
    Feature, specificationType
} from './feature';

const FEATURES = [
    new Feature('home-screen',
        {test: () => window.BeforeInstallPromptEvent, specification: specificationType.STANDARD}),
    new Feature('push-notifications',
        {test: () => window.PushManager, specification: specificationType.STANDARD},
        {test: () => window.Notification, specification: specificationType.STANDARD},
        {
            test: () => ServiceWorkerRegistration && ServiceWorkerRegistration.prototype && ServiceWorkerRegistration.prototype.showNotification,
            specification: specificationType.STANDARD
        },
        {test: () => window.safari.pushNotification, specification: specificationType.VENDOR}),
    new Feature('device-orientation',
        {test: () => window.DeviceOrientationEvent, specification: specificationType.STANDARD}),
    new Feature('network-type-speed',
        {test: () => navigator.connection, specification: specificationType.STANDARD},
        {test: () => navigator.mozConnection, specification: specificationType.VENDOR},
        {test: () => navigator.webkitConnection, specification: specificationType.VENDOR},
        {test: () => navigator.msConnection, specification: specificationType.VENDOR}),
    new Feature('bluetooth',
        {test: () => navigator.bluetooth, specification: specificationType.STANDARD}),
    new Feature('usb',
        {test: () => navigator.usb, specification: specificationType.STANDARD}),
    new Feature('online-state',
        {test: () => navigator.onLine, specification: specificationType.STANDARD}),
    new Feature('device-RAM-memory',
        {test: () => navigator.deviceMemory, specification: specificationType.STANDARD}),
    new Feature('ambient-light',
        {test: () => window.ondevicelight, specification: specificationType.STANDARD},
        {test: () => window.AmbientLightSensor, specification: specificationType.STANDARD}),
    new Feature('battery-status',
        {test: () => navigator.batter, specification: specificationType.STANDARD},
        {test: () => navigator.getBattery, specification: specificationType.STANDARD}),
    new Feature('vibration',
        {test: () => navigator.vibrate, specification: specificationType.STANDARD}),
    new Feature('geolocation',
        {test: () => navigator.geolocation, specification: specificationType.STANDARD}),
    new Feature('device-position',
        {test: () => window.DeviceOrientationEvent, specification: specificationType.STANDARD},
        {test: () => window.AbsoluteOrientationSensor, specification: specificationType.STANDARD},
        {test: () => window.RelativeOrientationSensor, specification: specificationType.STANDARD}),
    new Feature('storage-quota',
        {test: () => navigator.storage && navigator.storage.estimate, specification: specificationType.STANDARD},
        {test: () => navigator.webkitPersistentStorage, specification: specificationType.VENDOR}),
    new Feature('gyroscope',
        {test: () => window.Gyroscope, specification: specificationType.STANDARD}),
    new Feature('accelerometer',
        {test: () => window.Accelerometer, specification: specificationType.STANDARD}),
    new Feature('device-motion',
        {test: () => window.DeviceMotionEvent, specification: specificationType.STANDARD}),
    new Feature('speech-recognition',
        {test: () => window.SpeechRecognition, specification: specificationType.STANDARD},
        {test: () => window.webkitSpeechRecognition, specification: specificationType.STANDARD})
];

export default {
    get: () => FEATURES
};
