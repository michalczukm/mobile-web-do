import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { makeExampleId } from './features-utils';

const exampleUsage = `
// current orientation
const type = window.screen.orientation.type;

// orientation changed
window.screen.orientation.addEventListener('change', () => {
    console.log(window.screen.orientation);
});
`;

export default new Feature(
    'screen-orientation',
    exampleUsage,
    () => {
        const orientationApi =
            window.screen.orientation ||
            window.screen.mozOrientation ||
            window.screen.msOrientation ||
            window.screen.lockOrientation ||
            {};

        const getOrientation = () => orientationApi.type || '';

        return {
            component: Vue.component(makeExampleId('screen-orientation'), {
                template: `<div><h4>{{orientation}}</h4></div>`,
                data: () => ({
                    orientation: '',
                    eventsSubscription: createEventsSubscription(orientationApi),
                }),
                created: function() {
                    const setOrientation = () => (this.orientation = getOrientation());

                    this.eventsSubscription.subscribe('change', setOrientation);

                    setOrientation();
                },
                beforeDestroy: function() {
                    this.eventsSubscription.unsubscribeAll();
                },
            }),
            infoArray: [],
        };
    },
    { test: () => window.screen.orientation, specification: specificationType.STANDARD },
    { test: () => window.screen.mozOrientation, specification: specificationType.VENDOR },
    { test: () => window.screen.msOrientation, specification: specificationType.VENDOR },
    { test: () => window.screen.lockOrientation, specification: specificationType.VENDOR },
);
