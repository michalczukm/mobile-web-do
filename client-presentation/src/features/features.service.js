import {
    Feature, specificationType
} from './feature';
import Vue from 'vue';

const makeExampleId = (identifier) => `${identifier}-example-in-browser`;

const FEATURES = [
    new Feature('home-screen',
        () => {},
        {test: () => window.BeforeInstallPromptEvent, specification: specificationType.STANDARD}),
    new Feature('notifications-api',
        () => {
            Notification
            ? Notification.requestPermission().then(() => {
                // eslint-disable-next-line no-new
                new Notification('Notifications API', {
                    body: 'Mobile browsers can do notifications :)'
                });
            })
            : navigator.serviceWorker.ready.then(registration =>
                registration.showNotification('Push API', {
                    body: 'Mobile browsers can do push notifications :)'
                }));

            return {
                infoArray: [`Please allow permission to see result`]
            };
        },
        {test: () => window.Notification, specification: specificationType.STANDARD},
        {
            test: () => ServiceWorkerRegistration && ServiceWorkerRegistration.prototype && ServiceWorkerRegistration.prototype.showNotification,
            specification: specificationType.STANDARD
        }),
    new Feature('push-api',
        () => ({ infoArray: ['No server PUSH example provide. You have to trust me :)'] }),
        {test: () => window.PushManager, specification: specificationType.STANDARD},
        {test: () => window.safari.pushNotification, specification: specificationType.VENDOR}),
    new Feature('screen-orientation',
        () => {
            const orientationApi = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation || window.screen.lockOrientation || {};
            const getOrientation = () => orientationApi.type || '';
            const onOrientationChange = (callback) => orientationApi.addEventListener('change', callback);

            return {
                component: Vue.component(makeExampleId('screen-orientation'), {
                    template: `<div>{{orientation}}</div>`,
                    data: () => ({orientation: ''}),
                    created: function() {
                        const setOrientation = () => (this.orientation = getOrientation());
                        onOrientationChange(() => setOrientation());

                        setOrientation();
                    }
                }),
                infoArray: []
            };
        },
        {test: () => window.screen.orientation, specification: specificationType.STANDARD},
        {test: () => window.screen.mozOrientation, specification: specificationType.VENDOR},
        {test: () => window.screen.msOrientation, specification: specificationType.VENDOR},
        {test: () => window.screen.lockOrientation, specification: specificationType.VENDOR}),
    new Feature('device-orientation',
        () => ({
            component: Vue.component(makeExampleId('device-orientation'), {
                template: `
                    <div>
                        <ul>
                            <li>alpha: {{orientation.alpha | round}}</li>
                            <li>beta: {{orientation.beta | round}}</li>
                            <li>gamma: {{orientation.gamma | round}}</li>
                        </ul>
                    </div>`,
                data: () => ({orientation: {
                    alpha: 0,
                    beta: 0,
                    gamma: 0
                }}),
                created: function() {
                    window.addEventListener('deviceorientation', (orientation) => (this.orientation = orientation), false);
                },
                filters: {
                    round: (value) => Math.round(value)
                }
            }),
            infoArray: ['Example is using `window.DeviceOrientationEvent`']
        }),
        {test: () => window.DeviceOrientationEvent, specification: specificationType.STANDARD},
        {test: () => window.AbsoluteOrientationSensor, specification: specificationType.STANDARD},
        {test: () => window.RelativeOrientationSensor, specification: specificationType.STANDARD}),
    new Feature('network-type-speed',
        () => {
            const connection = navigator.connection || navigator.mozConnection ||
            navigator.webkitConnection || navigator.msConnection;
            return {
                infoArray: [
                    `Your connection type: ${connection.type}`,
                    `Your connection effective type: ${connection.effectiveType}`,
                    `Your RTT: ${connection.rtt}`,
                    `Your downlink: ${connection.downlink}`,
                    `Your downlinkMax: ${connection.downlinkMax}`
                ]
            };
        },
        {test: () => navigator.connection, specification: specificationType.STANDARD},
        {test: () => navigator.mozConnection, specification: specificationType.VENDOR},
        {test: () => navigator.webkitConnection, specification: specificationType.VENDOR},
        {test: () => navigator.msConnection, specification: specificationType.VENDOR}),
    new Feature('bluetooth',
        () => ({}),
        {test: () => navigator.bluetooth, specification: specificationType.STANDARD}),
    new Feature('usb',
        () => ({}),
        {test: () => navigator.usb, specification: specificationType.STANDARD}),
    new Feature('online-state',
        () => ({
            component: Vue.component(makeExampleId('online-state'), {
                template:
                    `<div v-bind:style="{color: onlineState ? 'green' : 'red'}">
                        {{ onlineState ? 'online' : 'offline' }}
                    </div>`,
                data: () => ({onlineState: false}),
                created: function() {
                    window.addEventListener('online', () => (this.onlineState = true));
                    window.addEventListener('offline', () => (this.onlineState = false));
                    this.onlineState = navigator.onLine;
                }
            }),
            infoArray: []
        }),
        {test: () => navigator.onLine, specification: specificationType.STANDARD}),
    new Feature('device-RAM-memory',
        () => {},
        {test: () => navigator.deviceMemory, specification: specificationType.STANDARD}),
    new Feature('ambient-light',
        () => {},
        {test: () => window.ondevicelight, specification: specificationType.STANDARD},
        {test: () => window.AmbientLightSensor, specification: specificationType.STANDARD}),
    new Feature('battery-status',
        () => {},
        {test: () => navigator.batter, specification: specificationType.STANDARD},
        {test: () => navigator.getBattery, specification: specificationType.STANDARD}),
    new Feature('vibration',
        () => {},
        {test: () => navigator.vibrate, specification: specificationType.STANDARD}),
    new Feature('geolocation',
        () => {},
        {test: () => navigator.geolocation, specification: specificationType.STANDARD}),
    new Feature('device-position',
        () => {},
        {test: () => window.DeviceOrientationEvent, specification: specificationType.STANDARD},
        {test: () => window.AbsoluteOrientationSensor, specification: specificationType.STANDARD},
        {test: () => window.RelativeOrientationSensor, specification: specificationType.STANDARD}),
    new Feature('storage-quota',
        () => {},
        {test: () => navigator.storage && navigator.storage.estimate, specification: specificationType.STANDARD},
        {test: () => navigator.webkitPersistentStorage, specification: specificationType.VENDOR}),
    new Feature('gyroscope',
        () => {},
        {test: () => window.Gyroscope, specification: specificationType.STANDARD}),
    new Feature('accelerometer',
        () => {},
        {test: () => window.Accelerometer, specification: specificationType.STANDARD}),
    new Feature('device-motion',
        () => {},
        {test: () => window.DeviceMotionEvent, specification: specificationType.STANDARD}),
    new Feature('speech-recognition',
        () => {},
        {test: () => window.SpeechRecognition, specification: specificationType.STANDARD},
        {test: () => window.webkitSpeechRecognition, specification: specificationType.STANDARD})
];

export default {
    get: () => FEATURES
};
