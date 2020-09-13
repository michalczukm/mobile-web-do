import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { axisMotion, rotation } from '../../view/filters';
import { makeExampleId } from './features-utils';

const exampleUsage = `// based on DeviceMotionEvent
window.addEventListener('devicemotion', motion => {
    const [accX, accY, accZ] = motion.acceleration;
    const [accWithGravX, accWithGravY, accWithGravZ] = motion.accelerationIncludingGravity;
    const [alpha, beta, gamma] = motion.rotationRate;
});
`;

export default new Feature(
    'device-motion',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('device-motion'), {
            template: `<div>
                        <p>acceleration:</p>
                        <p><b>{{motion.acceleration ? axisMotion(motion.acceleration) : 'loading'}}</b></p>
                        <p>accelerationIncludingGravity:</p>
                        <p><b>{{motion.accelerationIncludingGravity ? axisMotion(motion.accelerationIncludingGravity) : 'loading'}}</b></p>
                        <p>rotationRate:</p>
                        <p><b>{{motion.rotationRate ? rotation(motion.rotationRate) : 'loading'}}</b></p>
                        <p>interval: <b>{{motion.interval || 'loading'}}</b></p>
                    </div>`,
            data: () => ({
                motion: {},
                eventsSubscription: createEventsSubscription(),
            }),
            created: function() {
                this.eventsSubscription.subscribe(
                    'devicemotion',
                    motion => (this.motion = motion),
                    false,
                );
            },
            beforeDestroy: function() {
                this.eventsSubscription.unsubscribeAll();
            },
            methods: {
                axisMotion,
                rotation,
            },
        }),
        infoArray: [`This example uses DeviceMotionEvent`],
    }),
    {
        test: () => window.DeviceMotionEvent,
        specification: specificationType.STANDARD,
    },
);
