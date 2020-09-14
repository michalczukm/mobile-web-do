import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { axisMotion } from '../../view/filters';
import { logger } from '../../logging';
import { makeExampleId } from './features-utils';

const exampleUsage = `// request locking the screen
const wakeLock = await navigator.wakeLock.request('screen');

wakeLock.addEventListener('release', () => {
    console.log('Screen Wake Lock was released');
});
`;

export default new Feature(
    'wake-lock',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('wake-lock'), {
            template: `
                    <div>
                        <h4>Actions related to Screen Wake Lock</h4>
                        <table style="padding: 5%; display: table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="({time, type}, index) in events" v-bind:key="index">
                                    <td>{{ time }}</td>
                                    <td>{{ type }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`,
            data: () => ({
                events: [],
                wakeLockEventsSubscription: null,
                documentEventsSubscription: createEventsSubscription(),
                wakeLock: null,
            }),
            created: async function() {
                const recordEvent = type =>
                    this.events.push({
                        time: new Date().toLocaleTimeString(),
                        type,
                    });

                const requestWakeLock = async () => {
                    try {
                        this.wakeLock = await navigator.wakeLock.request('screen');
                        this.wakeLockEventsSubscription = createEventsSubscription(this.wakeLock);

                        this.wakeLockEventsSubscription.subscribe('release', () => {
                            recordEvent('released');
                            logger.info('Screen Wake Lock was released');
                        });

                        recordEvent('locked');
                        logger.info('Screen Wake Lock is active');
                    } catch (error) {
                        recordEvent('failed');
                        logger.error('Screen Wake Lock failed', error);
                    }
                };

                const handleVisibilityChange = () => {
                    if (this.wakeLock !== null && document.visibilityState === 'visible') {
                        requestWakeLock();
                    }
                };

                this.documentEventsSubscription.subscribe(
                    'visibilitychange',
                    handleVisibilityChange,
                );

                await requestWakeLock();
            },
            beforeDestroy: function() {
                this.wakeLockEventsSubscription.unsubscribeAll();
                this.documentEventsSubscription.unsubscribeAll();
                this.wakeLock.release();
                this.wakeLock = null;
            },
            methods: {
                axisMotion,
            },
        }),
        infoArray: [],
    }),
    {
        test: () => navigator.wakeLock,
        specification: specificationType.STANDARD,
    },
);
