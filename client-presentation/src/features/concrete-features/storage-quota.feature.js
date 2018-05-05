import Vue from 'vue';
import {
    Feature,
    specificationType
} from '../feature';
import {
    makeExampleId
} from './features-utils';

export default new Feature('storage-quota',
    `const [usage, quota] = navigator.storage;`,
    () => ({
        component: Vue.component(makeExampleId('storage-quota'), {
            template: `<div>
                        <p>Used storage for page: ~{{storage.usage | mb}} MB</p>
                        <p>Quota storage for page: ~{{storage.quota | mb}} MB</p>
                    </div>`,
            data: () => ({
                storage: {}
            }),
            created: function () {
                (navigator.storage || navigator.webkitPersistentStorage).estimate()
                    .then(storage => (this.storage = storage));
            },
            filters: {
                mb: function (value) {
                    const round = (value) => Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2);
                    return value > 0 ? round(value / 1024 / 1024) : 0;
                }
            }
        })
    }), {
        test: () => navigator.storage && navigator.storage.estimate,
        specification: specificationType.STANDARD
    }, {
        test: () => navigator.webkitPersistentStorage,
        specification: specificationType.VENDOR
    }
);
