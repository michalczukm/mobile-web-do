import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { makeExampleId } from './features-utils';

const exampleUsage = `
window.addEventListener('deviceproximity', event => {
    console.log(event.value + 'cm', event.min + 'cm', event.max + 'cm');
});

window.addEventListener('userproximity', event => {
    console.log(event.near);
});
`;

export default new Feature(
    'proximity',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('proximity'), {
            template: `
                <div>
                    <p>Current approximate distance to object is <b>{{ deviceValue }}</b>.</p>
                    <p>Currently, the object is <b>{{ nearValue }}</b>.</p>
                
                    <div v-bind:style="{ width: boxSize + 'px', height: boxSize + 'px', backgroundColor: nearValue === 'near' ? 'red' : 'green'}"></div>
                </div>
            `,
            data: () => ({
                events: [],
                deviceValue: 'unknown',
                nearValue: 'in unknown proximity',
                eventsSubscription: createEventsSubscription(),
                boxSize: 100,
            }),
            created: async function() {
                this.eventsSubscription.subscribe('deviceproximity', event => {
                    this.deviceValue = `${event.value} cm (${event.min}-${event.max} cm range)`;
                    this.size = Math.min(200, Math.max(20, 500 / (event.value || 1)));
                });

                this.eventsSubscription.subscribe('userproximity', event => {
                    this.nearValue = event.near ? 'near' : 'rather far';
                });
            },
            beforeDestroy: function() {
                this.eventsSubscription && this.eventsSubscription.unsubscribeAll();
            },
        }),
        infoArray: ['Example from whatwebcando.today/proximity.html'],
    }),
    {
        test: () => window.ProximitySensor,
        specification: specificationType.STANDARD,
    },
    {
        test: () => 'ondeviceproximity' in window,
        specification: specificationType.OLD,
    },
    {
        test: () => 'onuserproximity' in window,
        specification: specificationType.OLD,
    },
);
