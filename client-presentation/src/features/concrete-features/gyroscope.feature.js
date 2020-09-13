import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { makeExampleId } from './features-utils';

const exampleUsage = `// based on new GenericSensorAPI
const gyroscope = new Gyroscope();
gyroscope.addEventListener('reading', result => {
    [x, y, z] = result;
}));
gyroscope.start();
`;

export default new Feature(
    'gyroscope',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('gyroscope'), {
            template: `<div>
                        <p>event: {{event}}</p>
                        <p>gyroscope: <b>{{result || 'loading' | axisMotion}}</b></p>
                    </div>`,
            data: () => ({
                result: {},
                event: {},
                eventsSubscription: null,
            }),
            created: function() {
                // eslint-disable-next-line no-undef
                const gyroscope = new Gyroscope();

                this.eventsSubscription = createEventsSubscription(gyroscope);

                this.eventsSubscription.subscribe('reading', event => {
                    this.event = event;
                    this.result = gyroscope;
                });

                gyroscope.start();
            },
            beforeDestroy: function() {
                this.eventsSubscription.unsubscribeAll();
            },
            filters: {
                axisMotion: value =>
                    ['x', 'y', 'z']
                        .map(key => `${key}: ${(value[key] || 0).toFixed(2)}`, '')
                        .join(','),
            },
        }),
        infoArray: [`This example uses Gyroscope`],
    }),
    {
        test: () => window.Gyroscope,
        specification: specificationType.STANDARD,
    },
);
