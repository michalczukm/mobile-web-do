import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { makeExampleId } from './features-utils';

const exampleUsage = `
window.addEventListener('deviceorientation', (orientation) => {
    [alpha, beta, gamma] = orientation;
});
`;

export default new Feature('device-orientation',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('device-orientation'), {
            template: `
                <div>
                    <ul>
                        <li>alpha: {{orientation.alpha | round}}</li>
                        <li>beta: {{orientation.beta | round}}</li>
                        <li>gamma: {{orientation.gamma | round}}</li>
                    </ul>
                </div>`,
            data: () => ({orientation: {
                alpha: 0,
                beta: 0,
                gamma: 0
            }}),
            created: function() {
                window.addEventListener('deviceorientation', (orientation) => (this.orientation = orientation), false);
            },
            filters: {
                round: (value) => Math.round(value)
            }
        }),
        infoArray: ['Example is using `window.DeviceOrientationEvent`']
    }),
    {test: () => window.DeviceOrientationEvent, specification: specificationType.STANDARD},
    {test: () => window.AbsoluteOrientationSensor, specification: specificationType.STANDARD},
    {test: () => window.RelativeOrientationSensor, specification: specificationType.STANDARD}
);
