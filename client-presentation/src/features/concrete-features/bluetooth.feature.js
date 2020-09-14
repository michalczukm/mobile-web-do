import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { logger } from '../../logging';
import { makeExampleId } from './features-utils';

const exampleUsage = `
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
`;

export default new Feature(
    'bluetooth',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('bluetooth'), {
            template: `
                    <div>
                        <h4>Connected bluetooth devices</h4>
                        <button v-on:click="connectDevices">Press me</button>
                        <hr />
                        <div>
                            <h5>Connected devices:</h5>
                            <p><b>{{ connectedDevices.length > 0 ? connectedDevices.map(dev => dev.name) : 'none' }}</b></p>
                        </div>
                    </div>
            `,
            data: () => ({
                connectedDevices: [],
            }),
            methods: {
                connectDevices: function() {
                    navigator.bluetooth
                        .requestDevice({
                            acceptAllDevices: true,
                        })
                        .then(device => {
                            this.connectedDevices.push(device);
                        })
                        .catch(error => {
                            logger.error('Bluetooth API example failed', error);
                        });
                },
            },
        }),
        infoArray: [`The API requires user interaction.`],
    }),
    { test: () => navigator.bluetooth, specification: specificationType.STANDARD },
);
