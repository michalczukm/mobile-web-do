import Vue from 'vue';
import { Feature, specificationType } from '../feature';
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
            }),
            created: function() {
                window.addEventListener('online', () => (this.onlineState = true));
                window.addEventListener('offline', () => (this.onlineState = false));
                this.onlineState = navigator.onLine;
            },
        }),
        infoArray: [],
    }),
    {
        test: () => navigator.onLine,
        specification: specificationType.STANDARD,
    },
);
