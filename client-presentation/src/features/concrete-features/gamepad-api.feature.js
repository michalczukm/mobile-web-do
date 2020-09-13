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
                        <h5>
                            {{ connectedGamepads }}
                        </h5>
                        <div v-if="!!gamepadInfo" style="padding: 5%">
                            <h4><b>Gamepad</b> {{ gamepadInfo.id }}</h4>
                            <p>Axes: {{ showAxes(gamepadInfo.axes) }}</p>

                            <h5>Buttons</h5>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Button</th>
                                        <th>Pressed / Touched</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(button, index) in gamepadInfo.buttons" v-bind:key="index">
                                        <td>{{ index }}</td>
                                        <td>{{ button.pressed }} / {{ button.touched }}</td>
                                        <td><i v-bind:style="{ color: button.value ? 'red' : 'gray' }" class="fa fa-3x fa-gamepad"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>`,
            data: () => ({
                connectedGamepads: [],
                gamepadInfo: null,
                loopIntervalHandler: null,
            }),
            created: function() {
                const getGamepads = () =>
                    navigator.getGamepads
                        ? navigator.getGamepads()
                        : navigator.webkitGetGamepads
                        ? navigator.webkitGetGamepads()
                        : [];

                // eslint-disable-next-line no-unused-vars
                const loop = () => {
                    const gamepads = Array.from(getGamepads());

                    this.connectedGamepads = gamepads.filter(Boolean).map(({ id }) => id);
                    this.gamepadInfo = gamepads.length >= 1 ? gamepads[0] : null;
                };

                this.loopIntervalHandler = setInterval(loop, 300);
            },
            methods: {
                showAxes: function(axes) {
                    return axes.map(position => position.toFixed(2));
                },
            },
            beforeDestroy: function() {
                clearInterval(this.loopIntervalHandler);
                console.log('===gamepad api destroyed');
            },
        }),
        infoArray: ['If you already connected gamepad - please press any button'],
    }),
    {
        test: () => navigator.getGamepads,
        specification: specificationType.STANDARD,
    },
    {
        test: () => navigator.webkitGetGamepads,
        specification: specificationType.VENDOR,
    },
    {
        test: () => window.ongamepadconnected,
        specification: specificationType.STANDARD,
    },
    {
        test: () => window.ongamepaddisconnected,
        specification: specificationType.STANDARD,
    },
);
