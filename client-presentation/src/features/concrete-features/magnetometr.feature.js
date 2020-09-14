import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { axisMotion } from '../../view/filters';
import { makeExampleId } from './features-utils';

export default new Feature(
    'magnetometer',
    `// based on new GenericSensorAPI
const sensor = new Magnetometer({ frequency: 60 });
sensor.addEventListener('reading', () => {
    [x, y, z] = sensor;
}));
sensor.start();
`,
    () => ({
        component: Vue.component(makeExampleId('magnetometer'), {
            template: `<div>
                        <p>event: {{JSON.stringify(event, null, 2)}}</p>
                        <p>Magnetic field: <b>{{result ? axisMotion(result) :  'loading' }}</b></p>
                    </div>`,
            data: () => ({
                result: {},
                event: {},
                eventsSubscription: null,
            }),
            created: function() {
                // eslint-disable-next-line no-undef
                const sensor = new Magnetometer();

                this.eventsSubscription = createEventsSubscription(sensor);

                this.eventsSubscription.subscribe('reading', event => {
                    this.event = event;
                    this.result = sensor;
                });

                sensor.start();
            },
            beforeDestroy: function() {
                this.eventsSubscription.unsubscribeAll();
            },
            methods: {
                axisMotion,
            },
        }),
        infoArray: [`This example uses Magnetometer`],
    }),
    {
        test: () => window.Magnetometer,
        specification: specificationType.STANDARD,
    },
);
