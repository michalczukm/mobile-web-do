import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { axisMotion } from '../../view/filters';
import { makeExampleId } from './features-utils';

export default new Feature(
    'accelerometer',
    `// based on new GenericSensorAPI
const accelerometer = new Accelerometer();
accelerometer.addEventListener('reading', result => {
    [x, y, z] = result;
}));
accelerometer.start();
`,
    () => ({
        component: Vue.component(makeExampleId('accelerometer'), {
            template: `<div>
                        <p>event: {{JSON.stringify(event, null, 2)}}</p>
                        <p>acceleration: <b>{{result ? axisMotion(result) :  'loading' }}</b></p>
                    </div>`,
            data: () => ({
                result: {},
                event: {},
                eventsSubscription: null,
            }),
            created: function() {
                // eslint-disable-next-line no-undef
                const accelerometer = new Accelerometer();

                this.eventsSubscription = createEventsSubscription(accelerometer);

                this.eventsSubscription.subscribe('reading', event => {
                    this.event = event;
                    this.result = accelerometer;
                });

                accelerometer.start();
            },
            beforeDestroy: function() {
                this.eventsSubscription.unsubscribeAll();
            },
            methods: {
                axisMotion,
            },
        }),
        infoArray: [`This example uses Accelerometer`],
    }),
    {
        test: () => window.Accelerometer,
        specification: specificationType.STANDARD,
    },
);
