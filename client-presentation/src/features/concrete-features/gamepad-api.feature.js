import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { makeExampleId } from './features-utils';

const exampleUsage = `// get connected gamepads 
var gamepads = navigator.getGamepads();
  
// gamepad fields
Gamepad.buttons, Gamepad.axes, Gamepad.connected ...
  

window.addEventListener("gamepadconnected", (event) => {
    // we even have event for gamepad connected!
});
`;

export default new Feature(
    'gamepad-api',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('gamepad-api'), {
            template: `<div>
                        <h4>Connected Gamepads:</h4>
                        <h5>{{ gamepads }}</h5>
                    </div>`,
            data: () => ({
                gamepads: [],
            }),
            created: function() {
                this.gamepads = navigator.getGamepads();
            },
        }),
        infoArray: ['It would be nice to have a gamepad now'],
    }),
    {
        test: () => navigator.getGamepads,
        specification: specificationType.STANDARD,
    },
);
