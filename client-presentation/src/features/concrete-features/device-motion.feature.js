import Vue from 'vue';
import {
    Feature,
    specificationType
} from '../feature';
import {
    makeExampleId,
    humanReadableByKeys
} from './features-utils';

const exampleUsage = `// based on DeviceMotionEvent
window.addEventListener('devicemotion', motion => {
    const [accX, accY, accZ] = motion.acceleration;
    const [accWithGravX, accWithGravY, accWithGravZ] = motion.accelerationIncludingGravity;
    const [alpha, beta, gamma] = motion.rotationRate;
});
`;

export default new Feature('device-motion',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('device-motion'), {
            template: `<div>
                        <p>acceleration:</p>
                        <p><b>{{motion.acceleration || 'loading' | axisMotion}}</b></p>
                        <p>accelerationIncludingGravity:</p>
                        <p><b>{{motion.accelerationIncludingGravity || 'loading' | axisMotion}}</b></p>
                        <p>rotationRate:</p>
                        <p><b>{{motion.rotationRate || 'loading' | rotation}}</b></p>
                        <p>interval: <b>{{motion.interval || 'loading'}}</b></p>
                    </div>`,
            data: () => ({
                motion: {}
            }),
            created: function () {
                window.addEventListener('devicemotion', (motion) => (this.motion = motion), false);
            },
            filters: {
                axisMotion: (value) => humanReadableByKeys(value, 'x', 'y', 'z'),
                rotation: (value) => humanReadableByKeys(value, 'alpha', 'beta', 'gamma')
            }
        }),
        infoArray: [`This example uses DeviceMotionEvent`]
    }), {
        test: () => window.DeviceMotionEvent,
        specification: specificationType.STANDARD
    }
);
