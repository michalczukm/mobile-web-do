import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { makeExampleId } from './features-utils';

const exampleUsage = `// get current location
navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
});

// or listen for the changes
navigator.geolocation.watchLocation(callback)
`;
export default new Feature(
    'geolocation',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('geolocation'), {
            template: `<div>
                        <p>latitude: {{position.latitude || 'loading'}}</p>
                        <p>longitude: {{position.longitude || 'loading'}}</p>
                    </div>`,
            data: () => ({
                position: {},
            }),
            created: function() {
                navigator.geolocation.getCurrentPosition(
                    position =>
                        (this.position = {
                            latitude: position.coords.latitude.toFixed(5),
                            longitude: position.coords.longitude.toFixed(5),
                        }),
                );
            },
        }),
        infoArray: [`It might take some time`],
    }),
    {
        test: () => navigator.geolocation,
        specification: specificationType.STANDARD,
    },
);
