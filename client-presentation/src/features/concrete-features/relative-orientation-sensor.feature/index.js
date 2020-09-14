import Vue from 'vue';
import Quaternion from 'quaternion';
import { Feature, specificationType } from '../../feature';
import { createEventsSubscription } from '../../../utils';
import { axisMotion } from '../../../view/filters';
import { makeExampleId } from '../features-utils';

import RotateVisualization from './RotateVisualization.vue';

export default new Feature(
    'relative-orientation-sensor',
    `// based on new GenericSensorAPI
const sensor = new RelativeOrientationSensor();
sensor.addEventListener('reading', () => {
    console.log(sensor.quaternion);
}));
sensor.start();
`,
    () => ({
        component: Vue.component(makeExampleId('relative-orientation-sensor'), {
            components: {
                RotateVisualization,
            },
            template: `<div>
                        <rotate-visualization v-if="!!matrixParams" v-bind:matrixParams="matrixParams"></rotate-visualization>
                    </div>`,
            data: () => ({
                matrixParams: '',
                eventsSubscription: null,
            }),
            created: function() {
                // eslint-disable-next-line no-undef
                const sensor = new RelativeOrientationSensor({
                    frequency: 60,
                    referenceFrame: 'device',
                });

                this.eventsSubscription = createEventsSubscription(sensor);

                this.eventsSubscription.subscribe('reading', () => {
                    const quaterion = new Quaternion(sensor.quaternion);
                    this.matrixParams = quaterion.conjugate().toMatrix4();
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
        infoArray: [`This example uses RelativeOrientationSensor`],
    }),
    {
        test: () => window.RelativeOrientationSensor,
        specification: specificationType.STANDARD,
    },
);
