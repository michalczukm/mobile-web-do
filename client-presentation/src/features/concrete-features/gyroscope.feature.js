import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { makeExampleId, humanReadableByKeys } from './features-utils';

const exampleUsage = `// based on new GenericSensorAPI
const gyroscope = new Gyroscope();
gyroscope.addEventListener('reading', result => {
    [x, y, z] = result;
}));
gyroscope.start();
`;

export default new Feature('gyroscope',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('gyroscope'), {
            template: `<div>
                        <p>gyroscope: <b>{{result || 'loading' | axisMotion}}</b></p>
                    </div>`,
            data: () => ({
                result: {}
            }),
            created: function () {
                // eslint-disable-next-line no-undef
                const gyroscope = new Gyroscope();
                gyroscope.addEventListener('reading', result => (this.result = result));
                gyroscope.start();
            },
            filters: {
                axisMotion: (value) => humanReadableByKeys(value, 'x', 'y', 'z')
            }
        }),
        infoArray: [`This example uses Accelerometer`]
    }), {
        test: () => window.Gyroscope,
        specification: specificationType.STANDARD
    }
);
