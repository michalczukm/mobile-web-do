import Vue from 'vue';
import {
    Feature,
    specificationType
} from '../feature';
import {
    makeExampleId
} from './features-utils';

export default new Feature('vibration',
    `// this was the 'melody' you felt
navigator.vibrate([500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]);`,
    () => ({
        component: Vue.component(makeExampleId('vibration'), {
            template: `<div>
                    <button v-on:click="vibrate">Press me</button>
                </div>`,
            methods: {
                vibrate: function () {
                    navigator.vibrate([500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]);
                }
            }
        }),
        infoArray: [`The API required to be launched by tapping frame.`]
    }), {
        test: () => navigator.vibrate,
        specification: specificationType.STANDARD
    }
);
