import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { createEventsSubscription } from '../../utils';
import { makeExampleId } from './features-utils';

const exampleUsage = `// the absolutely simplest case, when we want only most probable results, no alternatives
this.recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
this.recognizer.continuous = true;

this.recognizer.addEventListener('result', event => {
    this.recognitions = Array.from(event.results)
        .filter(res => res.isFinal)
        .map(res => res[0].transcript));
});`;

export default new Feature(
    'speech-recognition',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('speech-recognition'), {
            template: `<div>
                        <button v-on:click="listen"
                            v-bind:class="{'button-outline': listening}" class="button">
                            {{ listening ? 'Stop listening' : 'Start listening' }}
                        </button>
                        <button v-on:click="clear" class="button button-clear">Clear the text</button>
                        <p>You said:<p>
                        <blockquote v-if="recognitions.length > 0">
                            <p v-for="(recognition, index) in recognitions" v-bind:key="index">
                                <em>{{recognition.text}}</i> | confidence: {{recognition.confidencePercentage}} %</em>
                            </p>
                        </blockquote>
                    </div>`,
            data: () => ({
                listening: false,
                recognitions: [],
                recognizer: {},
                eventsSubscription: null,
            }),
            created: function() {
                this.recognizer = new (window.SpeechRecognition ||
                    window.webkitSpeechRecognition)();
                this.recognizer.continuous = true;

                this.eventsSubscription = createEventsSubscription(this.recognizer);

                this.eventsSubscription.subscribe('result', event => {
                    this.recognitions = Array.from(event.results)
                        .filter(res => res.isFinal)
                        .map(res => ({
                            text: res[0].transcript,
                            confidencePercentage: (res[0].confidence * 100).toFixed(2),
                        }));
                });
            },
            beforeDestroy: function() {
                this.eventsSubscription.unsubscribeAll();
            },
            methods: {
                listen: function() {
                    this.listening = !this.listening;

                    if (this.listening) {
                        this.recognizer.start();
                    } else {
                        this.recognizer.stop();
                    }
                },
                clear: function() {
                    this.recognitions = [];
                },
            },
        }),
    }),
    {
        test: () => window.SpeechRecognition,
        specification: specificationType.STANDARD,
    },
    {
        test: () => window.webkitSpeechRecognition,
        specification: specificationType.VENDOR,
    },
);
