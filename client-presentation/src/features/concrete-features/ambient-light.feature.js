import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { makeExampleId } from './features-utils';

const exampleUsage =
`// based on new GenericSensorAPI
const sensor = new AmbientLightSensor();
sensor.addEventListener('reading', (_) => {
    const illuminance = sensor.illuminance;
});
sensor.start();`;

export default new Feature('ambient-light',
    exampleUsage,
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
    {test: () => window.AmbientLightSensor, specification: specificationType.STANDARD}
);
