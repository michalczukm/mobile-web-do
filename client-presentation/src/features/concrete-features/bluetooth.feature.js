import { Feature, specificationType } from '../feature';

export default new Feature('bluetooth',
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
    { test: () => navigator.bluetooth, specification: specificationType.STANDARD }
);
