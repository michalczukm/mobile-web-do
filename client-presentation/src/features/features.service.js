import {
    Feature, specificationType
} from './feature';
import Vue from 'vue';

const makeExampleId = (identifier) => `${identifier}-example-in-browser`;
const isInObject = (object, ...keys) => keys.every(key => key in object);

const humanReadableByKeys = (value, ...keys) => value instanceof Object && isInObject(value, ...keys)
    ? keys.map(key => `${key}: ${value[key].toFixed(5) || 0}`, '').join(',')
    : value;

const FEATURES = [
    new Feature('home-screen',
        () => ({}),
        {test: () => window.BeforeInstallPromptEvent, specification: specificationType.STANDARD}),
    new Feature('notifications-api',
        () => {
            const notification = { body: 'Mobile browsers can do notifications :)' };
            const showNotificationViaNotificationApi = () => new Notification('Notifications API', notification);

            Notification
            // workaround due to bug in Safari where `Notification.requestPermission()` returns undefined
            ? ((permissionPromise) => permissionPromise || Promise.resolve())(Notification.requestPermission())
                .then(() => showNotificationViaNotificationApi())
            : navigator.serviceWorker.ready.then(registration => registration.showNotification('Push API', notification));

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
        () => ({ infoArray: [`Your device has ~${navigator.deviceMemory} GB`] }),
        {test: () => navigator.deviceMemory, specification: specificationType.STANDARD}),
    new Feature('ambient-light',
        () => ({
            component: Vue.component(makeExampleId('ambient-light'), {
                template:
                    `<div>Illuminance on your sensor: <b>{{illuminance}}</b></div>`,
                data: () => ({illuminance: 0}),
                created: function() {
                    if (window.AmbientLightSensor) {
                        // eslint-disable-next-line no-undef
                        const sensor = new AmbientLightSensor();
                        sensor.addEventListener('reading', (_) => (this.illuminance = sensor.illuminance));
                        sensor.start();
                    } else {
                        this.illuminance = 'Not supported';
                    }
                }
            }),
            infoArray: [`Example is using AmbientLightSensor`]
        }),
        {test: () => window.ondevicelight, specification: specificationType.STANDARD},
        {test: () => window.AmbientLightSensor, specification: specificationType.STANDARD}),
    new Feature('battery-status',
        () => ({
            component: Vue.component(makeExampleId('battery-status'), {
                template:
                    `<div>Your device has {{level}}% battery</div>`,
                data: () => ({level: 0}),
                created: function() {
                    (navigator.getBattery() || Promise.resolve(navigator.battery)).then(battery => (this.level = Math.round(battery.level * 100)));
                }
            }),
            infoArray: []
        }),
        {test: () => navigator.battery, specification: specificationType.OLD},
        {test: () => navigator.getBattery, specification: specificationType.STANDARD}),
    new Feature('vibration',
        () => ({
            component: Vue.component(makeExampleId('vibration'), {
                template:
                    `<div>
                        <button v-on:click="vibrate">Press me</button>
                    </div>`,
                methods: {
                    vibrate: function() {
                        navigator.vibrate([500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]);
                    }
                }
            }),
            infoArray: [`The API required to be launched by tapping frame.`]
        }),
        {test: () => navigator.vibrate, specification: specificationType.STANDARD}),
    new Feature('geolocation',
        () => ({
            component: Vue.component(makeExampleId('geolocation'), {
                template:
                    `<div>
                        <p>latitude: {{position.latitude || 'loading'}}</p>
                        <p>longitude: {{position.longitude || 'loading'}}</p>
                    </div>`,
                data: () => ({
                    position: { }
                }),
                created: function() {
                    navigator.geolocation.getCurrentPosition(position => (this.position = {
                        latitude: position.coords.latitude.toFixed(5),
                        longitude: position.coords.longitude.toFixed(5)
                    }));
                }
            }),
            infoArray: [`It might take some time`]
        }),
        {test: () => navigator.geolocation, specification: specificationType.STANDARD}),
    new Feature('storage-quota',
        () => ({
            component: Vue.component(makeExampleId('storage-quota'), {
                template:
                    `<div>
                        <p>Used storage for page: ~{{storage.usage | mb}} MB</p>
                        <p>Quota storage for page: ~{{storage.quota | mb}} MB</p>
                    </div>`,
                data: () => ({storage: {}}),
                created: function() {
                    (navigator.storage || navigator.webkitPersistentStorage).estimate()
                        .then(storage => (this.storage = storage));
                },
                filters: {
                    mb: function(value) {
                        const round = (value) => Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);
                        return value > 0 ? round(value / 1024 / 1024) : 0;
                    }
                }
            })
        }),
        {test: () => navigator.storage && navigator.storage.estimate, specification: specificationType.STANDARD},
        {test: () => navigator.webkitPersistentStorage, specification: specificationType.VENDOR}),
    new Feature('share',
        () => ({
            component: Vue.component(makeExampleId('share'), {
                template:
                    `<div>
                        <button v-on:click="share">Share me</button>
                    </div>`,
                methods: {
                    share: function() {
                        const urlToShare = 'https://twitter.com/michalczukm';

                        const shareByIntent = () =>
                            // eslint-disable-next-line no-undef
                            navigator.startActivity(new Intent('http://webintents.org/share', 'text/uri-list', urlToShare));

                        const shareByShare = () => {
                            navigator.share({
                                title: 'I am on @michalczukm presentation about mobile browsers.',
                                text: 'This was send via `navigator.share feature. Quite experimental feature.',
                                url: urlToShare
                            });
                        };

                        'Intent' in window ? shareByIntent() : shareByShare();
                    }
                }
            }),
            infoArray: [`The API required to be launched by tapping frame.`]
        }),
        {test: () => navigator.share, specification: specificationType.STANDARD},
        {test: () => window.Intent, specification: specificationType.VENDOR}),
    new Feature('gyroscope',
        () => ({
            component: Vue.component(makeExampleId('gyroscope'), {
                template:
                    `<div>
                        <p>gyroscope: <b>{{result || 'loading' | axisMotion}}</b></p>
                    </div>`,
                data: () => ({
                    result: {}
                }),
                created: function() {
                    // eslint-disable-next-line no-undef
                    const accelerometer = new Gyroscope();
                    accelerometer.addEventListener('reading', result => (this.result = humanReadableByKeys(result, 'x', 'y', 'z')));
                    accelerometer.start();
                },
                filters: {
                    axisMotion: (value) => humanReadableByKeys(value, 'x', 'y', 'z')
                }
            }),
            infoArray: [`This example uses Accelerometer`]
        }),
        {test: () => window.Gyroscope, specification: specificationType.STANDARD}),
    new Feature('accelerometer',
        () => ({
            component: Vue.component(makeExampleId('accelerometer'), {
                template:
                    `<div>
                        <p>acceleration: <b>{{acceleration || 'loading' | axisMotion}}</b></p>
                    </div>`,
                data: () => ({
                    acceleration: ''
                }),
                created: function() {
                    // eslint-disable-next-line no-undef
                    const accelerometer = new Accelerometer();
                    accelerometer.addEventListener('reading', result => (this.acceleration = humanReadableByKeys(result, 'x', 'y', 'z')));
                    accelerometer.start();
                },
                filters: {
                    axisMotion: (value) => humanReadableByKeys(value, 'x', 'y', 'z')
                }
            }),
            infoArray: [`This example uses Accelerometer`]
        }),
        {test: () => window.Accelerometer, specification: specificationType.STANDARD}),
    new Feature('device-motion',
        () => ({
            component: Vue.component(makeExampleId('device-motion'), {
                template:
                    `<div>
                        <p>acceleration: <b>{{motion.acceleration || 'loading' | axisMotion}}</b></p>
                        <p>accelerationIncludingGravity: <b>{{motion.accelerationIncludingGravity || 'loading' | axisMotion}}</b></p>
                        <p>rotationRate: <b>{{motion.rotationRate || 'loading' | rotation}}</b></p>
                        <p>interval: <b>{{motion.interval || 'loading'}}</b></p>
                    </div>`,
                data: () => ({
                    motion: { }
                }),
                created: function() {
                    window.addEventListener('devicemotion', (motion) => (this.motion = motion), false);
                },
                filters: {
                    axisMotion: (value) => humanReadableByKeys(value, 'x', 'y', 'z'),
                    rotation: (value) => humanReadableByKeys(value, 'alpha', 'beta', 'gamma')
                }
            }),
            infoArray: [`This example uses DeviceMotionEvent`]
        }),
        {test: () => window.DeviceMotionEvent, specification: specificationType.STANDARD}),
    new Feature('speech-recognition',
        () => ({
            component: Vue.component(makeExampleId('device-motion'), {
                template:
                    `<div>
                        <button v-on:mousedown="listen" v-on:mouseup="stopListening" v-on:mouseleave="stopListening"
                            v-bind:class="{'button-outline': listening}" class="button">
                            Hold to speak
                        </button>
                        <button v-on:click="clear" class="button button-clear">Clear the text</button>
                        <p>You said:<p>
                        <blockquote>
                            <p v-for="(recognition, index) in recognitions" v-bind:key="index">
                                <em>{{recognition.text}}</i> | confidence: {{recognition.confidencePercentage}} %</em>
                            </p>
                        </blockquote>
                    </div>`,
                data: () => ({
                    listening: false,
                    recognitions: [],
                    recognizer: {}
                }),
                created: function() {
                    this.recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                    this.recognizer.continuous = true;

                    this.recognizer.addEventListener('result', event => {
                        this.recognitions = Array.from(event.results)
                            .filter(res => res.isFinal)
                            .map(res => ({ text: res[0].transcript, confidencePercentage: (res[0].confidence * 100).toFixed(2) }));
                    });
                },
                methods: {
                    listen: function() {
                        this.listening = true;
                        this.recognizer.start();
                    },
                    stopListening: function() {
                        this.listening = false;
                        this.recognizer.stop();
                    },
                    clear: function() {
                        this.recognitions = [];
                    }
                }
            })
        }),
        {test: () => window.SpeechRecognition, specification: specificationType.STANDARD},
        {test: () => window.webkitSpeechRecognition, specification: specificationType.STANDARD})
];

export default {
    get: () => FEATURES
};
