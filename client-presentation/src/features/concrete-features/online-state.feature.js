import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { makeExampleId } from './features-utils';

const exampleUsage = `//add listeners for online state change
window.addEventListener('online', () => {
    // you are online
});
window.addEventListener('offline', () => {
    // you are offline
});
`;

export default new Feature(
    'online-state',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('online-state'), {
            template: `<div v-bind:style="{color: onlineState ? 'green' : 'red'}">
                        <h4>{{ onlineState ? 'online' : 'offline' }}</h4>
                    </div>`,
            data: () => ({
                onlineState: false,
                eventsSubscription: createEventsSubscription(),
            }),
            created: function() {
                this.eventsSubscription.subscribe('online', () => (this.onlineState = true));
                this.eventsSubscription.subscribe('offline', () => (this.onlineState = false));

                this.onlineState = navigator.onLine;
            },
            beforeDestroy: function() {
                this.eventsSubscription.unsubscribeAll();
            },
        }),
        infoArray: [],
    }),
    {
        test: () => navigator.onLine,
        specification: specificationType.STANDARD,
    },
);
