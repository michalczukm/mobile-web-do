import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { makeExampleId } from './features-utils';

const exampleUsage = `
// current orientation
const type = window.screen.orientation.type;

// orientation changed
window.screen.orientation.addEventListener('change', _ => {
    ...
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
        const onOrientationChange = callback => orientationApi.addEventListener('change', callback);

        return {
            component: Vue.component(makeExampleId('screen-orientation'), {
                template: `<div><h4>{{orientation}}</h4></div>`,
                data: () => ({ orientation: '' }),
                created: function() {
                    const setOrientation = () => (this.orientation = getOrientation());
                    onOrientationChange(() => setOrientation());

                    setOrientation();
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
