import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { logger } from '../../logging';
import { makeExampleId } from './features-utils';

const exampleUsage = `
const idleDetector = new IdleDetector();

// get permissions
await IdleDetector.requestPermission();

idleDetector.addEventListener('change', () => {
    const userState = idleDetector.userState;
    const screenState = idleDetector.screenState;
    console.log(\`Idle change: \${userState}, \${screenState}.\`);
});

await idleDetector.start({
    threshold: 60000
});
`;

export default new Feature(
    'idle-detector',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('idle-detector'), {
            template: `
                    <div>
                        <h4>Idle detector records</h4>
                        <p v-if="!!permissionState"><b>Permission state:</b>{{ permissionState }}</p>
                        <table style="padding: 5%; display: table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>State</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="({time, type, userState, screenState, error}, index) in events" v-bind:key="index">
                                    <td>{{ time }}</td>
                                    <td>{{ type }}</td>
                                    <td>
                                        <template v-if="!!error">
                                            <i class="fa fa-exclamation-circle" style="color: red"></i> {{ error }}
                                        </template>
                                        <template v-else>
                                            <b>user:</b> {{ userState }} | <b>screen:</b> {{ screenState }}
                                        </template>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>`,
            data: () => ({
                events: [],
                permissionState: '',
                eventsSubscription: null,
                abortController: null,
            }),
            created: async function() {
                const recordEvent = (type, { userState, screenState }, error) =>
                    this.events.push({
                        time: new Date().toLocaleTimeString(),
                        type,
                        userState,
                        screenState,
                        error,
                    });

                /**
                 * According to documentation at https://web.dev/idle-detection/, IdleDetector have its own permissions,
                 * but it used to be hidden behind notifications permissions. Below is the fallback
                 */
                // eslint-disable-next-line no-undef
                if (IdleDetector.requestPermission) {
                    // eslint-disable-next-line no-undef
                    const state = await IdleDetector.requestPermission();
                    if (state !== 'granted') {
                        return;
                    }

                    this.permissionState = state;
                } else {
                    await Notification.requestPermission();
                    this.permissionState = Notification.permission;
                }

                try {
                    this.abortController = new AbortController();
                    const signal = this.abortController.signal;

                    // eslint-disable-next-line no-undef
                    const idleDetector = new IdleDetector();
                    this.eventsSubscription = createEventsSubscription(idleDetector);

                    this.eventsSubscription.subscribe('change', () => {
                        recordEvent('change', idleDetector);
                    });

                    await idleDetector.start({
                        threshold: 60000,
                        signal,
                    });
                } catch (error) {
                    recordEvent('failed', {}, error);
                    logger.error('Idle Detection failed', error);
                }
            },
            beforeDestroy: function() {
                this.eventsSubscription && this.eventsSubscription.unsubscribeAll();
                this.abortController.abort();
            },
        }),
        infoArray: [`Please grant permission to see the result`],
    }),
    {
        test: () => window.IdleDetector,
        specification: specificationType.STANDARD,
    },
);
