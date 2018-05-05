import Vue from 'vue';
import {
    Feature,
    specificationType
} from '../feature';
import {
    makeExampleId,
    humanReadableByKeys
} from './features-utils';

export default new Feature('accelerometer',
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
                        <p>acceleration: <b>{{acceleration || 'loading' | axisMotion}}</b></p>
                    </div>`,
            data: () => ({
                acceleration: ''
            }),
            created: function () {
                // eslint-disable-next-line no-undef
                const accelerometer = new Accelerometer();
                accelerometer.addEventListener('reading', result => (this.acceleration = result));
                accelerometer.start();
            },
            filters: {
                axisMotion: (value) => humanReadableByKeys(value, 'x', 'y', 'z')
            }
        }),
        infoArray: [`This example uses Accelerometer`]
    }), {
        test: () => window.Accelerometer,
        specification: specificationType.STANDARD
    }
);
