import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { axisMotion } from '../../view/filters';
import { makeExampleId } from './features-utils';

const exampleUsage = `// based on new GenericSensorAPI
const sensor = new Gyroscope();
sensor.addEventListener('reading', () => {
    [x, y, z] = gyroscope;
}));
sensor.start();
`;

export default new Feature(
    'gyroscope',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('gyroscope'), {
            template: `<div>
                        <p>event: {{JSON.stringify(event, null, 2)}}</p>
                        <p>gyroscope: <b>{{result ? axisMotion(result) :  'loading' }}</b></p>
                    </div>`,
            data: () => ({
                result: {},
                event: {},
                eventsSubscription: null,
            }),
            created: function() {
                // eslint-disable-next-line no-undef
                const sensor = new Gyroscope();

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
        infoArray: [`This example uses Gyroscope`],
    }),
    {
        test: () => window.Gyroscope,
        specification: specificationType.STANDARD,
    },
);
