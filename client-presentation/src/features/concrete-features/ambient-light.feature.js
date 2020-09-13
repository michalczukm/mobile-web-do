import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { makeExampleId } from './features-utils';

const exampleUsage = `// based on new GenericSensorAPI
const sensor = new AmbientLightSensor();
sensor.addEventListener('reading', (_) => {
    const illuminance = sensor.illuminance;
});
sensor.start();`;

export default new Feature(
    'ambient-light',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('ambient-light'), {
            template: `<div>Illuminance on your sensor: <b>{{illuminance}}</b></div>`,
            data: () => ({ illuminance: 0, eventsSubscription: null }),
            created: function() {
                if (window.AmbientLightSensor) {
                    // eslint-disable-next-line no-undef
                    const sensor = new AmbientLightSensor();

                    this.eventsSubscription = createEventsSubscription(sensor);

                    this.eventsSubscription.subscribe('reading', () => {
                        this.illuminance = sensor.illuminance;
                    });

                    sensor.start();
                } else {
                    this.illuminance = 'Not supported';
                }
            },
            beforeDestroy: function() {
                this.eventsSubscription.unsubscribeAll();
            },
        }),
        infoArray: [`This example uses AmbientLightSensor`],
    }),
    { test: () => window.ondevicelight, specification: specificationType.STANDARD },
    { test: () => window.AmbientLightSensor, specification: specificationType.STANDARD },
);
