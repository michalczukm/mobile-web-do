import {
    Feature, specificationType
} from './feature';
import Vue from 'vue';

const makeExampleId = (identifier) => `${identifier}-example-in-browser`;
const isInObject = (object, ...keys) => keys.every(key => key in object);

const humanReadableByKeys = (value, ...keys) => value instanceof Object && isInObject(value, ...keys)
    ? keys.map(key => `${key}: ${(value[key] || 0).toFixed(2)}`, '').join(',')
    : value;

const FEATURES = [
    new Feature('home-screen',
`// manifest.json
{
    "icons": {
        "48": "icon.png",
        "96": "icon@2x.png"
      },

      "manifest_version": 2,

      "name": "...",

      "start_url": "/",
      "background_color": "white",
      "display": "standalone",
      "orientation": "portrait"
      "version": "0.1"
}

// for safari
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="apple-touch-icon" href="assets/launcher/icon-1x.png">
<link rel="apple-touch-icon" sizes="192x192" href="assets/launcher/icon-4x.png">
`,
        () => ({}),
        {test: () => window.BeforeInstallPromptEvent, specification: specificationType.STANDARD}),

    new Feature('notifications-api',
`// for mobile
navigator.serviceWorker.ready
    .then(registration => registration.showNotification('Notification title', {
        body: 'Mobile browsers can do notifications :)'
}));

// for desktop
new Notification('Notification title', {
    body: 'Desktop browsers can do notifications :)'
});
        `,
        () => {
            const notification = { body: 'Mobile browsers can do notifications :)' };
            const showNotificationViaNotificationApi = () => new Notification('Notifications API', notification);

            if (Notification) {
                // workaround due to bug in Safari where `Notification.requestPermission()` returns undefined
                ((permissionPromise) => permissionPromise || Promise.resolve())(Notification.requestPermission())
                    .then(() => showNotificationViaNotificationApi());
            }
            navigator.serviceWorker.ready.then(registration => registration.showNotification('Notifications API', notification));

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
`
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
`,
        () => ({ infoArray: ['No server PUSH example provide. You have to trust me :)'] }),
        {test: () => window.PushManager, specification: specificationType.STANDARD},
        {test: () => window.safari.pushNotification, specification: specificationType.VENDOR}),

    new Feature('nfc',
`
// read messages
navigator.nfc.watch(message => {
    ...
});

// write message
navigator.nfc.push({
    records: [{ recordType: "url", data: "https://w3c.github.io/web-nfc/" }]
  }).then(() => {
    console.log("Message pushed.");
  });
`,
            () => ({}),
            {test: () => navigator.nfc, specification: specificationType.STANDARD},
            {test: () => navigator.mozNfz, specification: specificationType.VENDOR}),

    new Feature('screen-orientation',
`
// current orientation
const type = window.screen.orientation.type;

// orientation changed
window.screen.orientation.addEventListener('change', _ => {
    ...
});
`,
        () => {
            const orientationApi = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation || window.screen.lockOrientation || {};
            const getOrientation = () => orientationApi.type || '';
            const onOrientationChange = (callback) => orientationApi.addEventListener('change', callback);

            return {
                component: Vue.component(makeExampleId('screen-orientation'), {
                    template: `<div><h4>{{orientation}}</h4></div>`,
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
`
window.addEventListener('deviceorientation', (orientation) => {
    [alpha, beta, gamma] = orientation;
});
`,
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
`
// get current
const connection = navigator.connection;

// subscribe for event
navigator.connection.addEventListener('change', e => {
    ...
});

// by W3C draft:
enum ConnectionType {
    "bluetooth",
    "cellular",
    "ethernet",
    "mixed",
    "none",
    "other",
    "unknown",
    "wifi",
    "wimax"
};

enum EffectiveConnectionType {
    "2g",
    "3g",
    "4g",
    "slow-2g"
};

// The downlinkMax attribute represents an upper bound on the downlink speed of the first network hop. The reported value is in megabits per second
`,
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
`
// Connect to a Bluetooth Device
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
    .then(device => {
        // Human-readable name of the device.
        console.log(device.name);

        // Attempts to connect to remote GATT Server.
        return device.gatt.connect();
    })
    .then(server => { /* ... */ })
    .catch(error => { console.log(error); });
`,
        () => ({}),
        {test: () => navigator.bluetooth, specification: specificationType.STANDARD}),

    new Feature('usb',
`
// Talk to an Arduino USB board
var device;

navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
    .then(selectedDevice => {
        device = selectedDevice;
        return device.open(); // Begin a session.
    })
    .then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
    .then(() => device.claimInterface(2)) // Request exclusive control over interface #2.
    .then(() => device.controlTransferOut({
        requestType: 'class',
        recipient: 'interface',
        request: 0x22,
        value: 0x01,
        index: 0x02})) // Ready to receive data
    .then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint #5.
    .then(result => {
        let decoder = new TextDecoder();
        console.log('Received: ' + decoder.decode(result.data));
    })
    .catch(error => { console.log(error); });
`,
        () => ({}),
        {test: () => navigator.usb, specification: specificationType.STANDARD}),
    new Feature('online-state',
`//add listeners for online state change
window.addEventListener('online', () => {
    // you are online
});
window.addEventListener('offline', () => {
    // you are offline
});
`,
        () => ({
            component: Vue.component(makeExampleId('online-state'), {
                template:
                    `<div v-bind:style="{color: onlineState ? 'green' : 'red'}">
                        <h4>{{ onlineState ? 'online' : 'offline' }}</h4>
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
`// get current device memory. Estimated
const memory = navigator.deviceMemory;
`,
        () => ({ infoArray: [`Your device has ~${navigator.deviceMemory} GB`] }),
        {test: () => navigator.deviceMemory, specification: specificationType.STANDARD}),

    new Feature('ambient-light',
`// based on new GenericSensorAPI
const sensor = new AmbientLightSensor();
sensor.addEventListener('reading', (_) => {
    const illuminance = sensor.illuminance;
});
sensor.start();`,
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
`// get battery level - from 0 to 1, and other informations
navigator.getBattery()
    .then(battery => {
        const [level, charging, chargingTime, dischargingTime] = battery;
    });

// we can also subscribe for those data change events
battery.addEventListener('chargingchange', listener)
battery.addEventListener('chargingtimechange', listener)
battery.addEventListener('dischargingtimechange', listener)
battery.addEventListener('levelchange', listener)`,
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
`// this was the 'melody' you felt
navigator.vibrate([500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]);`,
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
`// get current location
navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
});

// or listen for the changes
navigator.geolocation.watchLocation(callback)
`,
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
`const [usage, quota] = navigator.storage;`,
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
`// by Android Intents
navigator.startActivity(new Intent('http://webintents.org/share', 'text/uri-list', 'https://example.com'));

// by share
navigator.share({
    title: 'I am on @michalczukm presentation about mobile browsers.',
    text: 'This was send via 'navigator.share' feature.',
    url: 'https://example.com'
});
`,
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
                                text: 'I am on @michalczukm presentation about mobile browsers. This was send via `navigator.share` feature. #webdev',
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
`// based on new GenericSensorAPI
const gyroscope = new Gyroscope();
gyroscope.addEventListener('reading', result => {
    [x, y, z] = result;
}));
gyroscope.start();
`,
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
                    const gyroscope = new Gyroscope();
                    gyroscope.addEventListener('reading', result => (this.result = result));
                    gyroscope.start();
                },
                filters: {
                    axisMotion: (value) => humanReadableByKeys(value, 'x', 'y', 'z')
                }
            }),
            infoArray: [`This example uses Accelerometer`]
        }),
        {test: () => window.Gyroscope, specification: specificationType.STANDARD}),

    new Feature('accelerometer',
`// based on new GenericSensorAPI
const accelerometer = new Accelerometer();
accelerometer.addEventListener('reading', result => {
    [x, y, z] = result;
}));
accelerometer.start();
`,
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
                    accelerometer.addEventListener('reading', result => (this.acceleration = result));
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
`// based on DeviceMotionEvent
window.addEventListener('devicemotion', motion => {
    const [accX, accY, accZ] = motion.acceleration;
    const [accWithGravX, accWithGravY, accWithGravZ] = motion.accelerationIncludingGravity;
    const [alpha, beta, gamma] = motion.rotationRate;
});
`,
        () => ({
            component: Vue.component(makeExampleId('device-motion'), {
                template:
                    `<div>
                        <p>acceleration:</p>
                        <p><b>{{motion.acceleration || 'loading' | axisMotion}}</b></p>
                        <p>accelerationIncludingGravity:</p>
                        <p><b>{{motion.accelerationIncludingGravity || 'loading' | axisMotion}}</b></p>
                        <p>rotationRate:</p>
                        <p><b>{{motion.rotationRate || 'loading' | rotation}}</b></p>
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
`// the absolutely simplest case, when we want only most probable results, no alternatives
this.recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
this.recognizer.continuous = true;

this.recognizer.addEventListener('result', event => {
    this.recognitions = Array.from(event.results)
        .filter(res => res.isFinal)
        .map(res => res[0].transcript));
});`,
        () => ({
            component: Vue.component(makeExampleId('speech-recognition'), {
                template:
                    `<div>
                        <button v-on:click="listen"
                            v-bind:class="{'button-outline': listening}" class="button">
                            {{ listening ? 'Stop listening' : 'Start listening' }}
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
                        this.listening = !this.listening;

                        if (this.listening) {
                            this.recognizer.start();
                        } else {
                            this.recognizer.stop();
                        }
                    },
                    clear: function() {
                        this.recognitions = [];
                    }
                }
            })
        }),
        {test: () => window.SpeechRecognition, specification: specificationType.STANDARD},
        {test: () => window.webkitSpeechRecognition, specification: specificationType.VENDOR})
];

export default {
    get: () => FEATURES
};
