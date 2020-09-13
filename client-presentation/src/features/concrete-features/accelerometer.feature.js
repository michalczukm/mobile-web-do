import Vue from 'vue';
import { Feature, specificationType } from '../feature';
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
                        <p>event: {{event}}</p>
                        <p>acceleration: <b>{{result || 'loading' | axisMotion}}</b></p>
                    </div>`,
            data: () => ({
                result: {},
                event: {},
            }),
            created: function() {
                // eslint-disable-next-line no-undef
                const accelerometer = new Accelerometer();
                accelerometer.addEventListener('reading', event => {
                    this.event = event;
                    this.result = accelerometer;
                });
                accelerometer.start();
            },
            filters: {
                axisMotion: value =>
                    ['x', 'y', 'z']
                        .map(key => `${key}: ${(value[key] || 0).toFixed(2)}`, '')
                        .join(','),
            },
        }),
        infoArray: [`This example uses Accelerometer`],
    }),
    {
        test: () => window.Accelerometer,
        specification: specificationType.STANDARD,
    },
);
