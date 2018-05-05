import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { makeExampleId } from './features-utils';

const exampleUsage = `// get battery level - from 0 to 1, and other informations
navigator.getBattery()
    .then(battery => {
        const [level, charging, chargingTime, dischargingTime] = battery;
    });

// we can also subscribe for those data change events
battery.addEventListener('chargingchange', listener)
battery.addEventListener('chargingtimechange', listener)
battery.addEventListener('dischargingtimechange', listener)
battery.addEventListener('levelchange', listener)`;

export default new Feature('battery-status',
    exampleUsage,
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
    {test: () => navigator.getBattery, specification: specificationType.STANDARD}
);
