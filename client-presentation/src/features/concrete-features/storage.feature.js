import Vue from 'vue';
import {
    Feature,
    specificationType
} from '../feature';
import {
    makeExampleId
} from './features-utils';

const exampleUsage =
`// store a value in the persistent storage
window.localStorage.myKey = 'value';

// read a value from the storage
console.log(window.localStorage.myKey); // prints 'value'

// remove a value from the storage
window.localStorage.removeItem('myKey');
`;

export default new Feature('storage',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('storage'), {
            data: function() {
                return {
                    value: window.localStorage.myKey || ''
                };
            },
            template: `<div>
                        <input type="text" placeholder="Data to store" v-model="value"/>
                    </div>`,
            watch: {
                value: function (value) {
                    window.localStorage.myKey = value;
                }
            }
        }),
        infoArray: [`Refresh the page and note the value is persisted.`]
    }), {
        test: () => window.localStorage,
        specification: specificationType.STANDARD
    }, {
        test: () => window.sessionStorage,
        specification: specificationType.STANDARD
    }, {
        test: () => window.indexedDB,
        specification: specificationType.STANDARD
    }
);
