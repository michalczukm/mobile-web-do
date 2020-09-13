import Vue from 'vue';
import { Feature, specificationType } from '../feature';
import { makeExampleId } from './features-utils';

const exampleUsage = `// by Android Intents
navigator.startActivity(new Intent('http://webintents.org/share', 'text/uri-list', 'https://example.com'));

// by share
navigator.share({
    title: 'I am on @michalczukm presentation about mobile browsers.',
    text: 'This was send via 'navigator.share' feature.',
    url: 'https://example.com'
});
`;

export default new Feature(
    'share',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('share'), {
            template: `<div>
                        <button v-on:click="share">Share me</button>
                    </div>`,
            methods: {
                share: function() {
                    const urlToShare = 'https://twitter.com/michalczukm';

                    const shareByIntent = () =>
                        navigator.startActivity(
                            // eslint-disable-next-line no-undef
                            new Intent('http://webintents.org/share', 'text/uri-list', urlToShare),
                        );

                    const shareByShare = () => {
                        navigator.share({
                            title: 'I am on @michalczukm presentation about mobile browsers.',
                            text:
                                'I am on @michalczukm presentation about mobile browsers. This was send via `navigator.share` feature. #webdev #javascript',
                            url: urlToShare,
                        });
                    };

                    'Intent' in window ? shareByIntent() : shareByShare();
                },
            },
        }),
        infoArray: [`The API requires user interaction.`],
    }),
    {
        test: () => navigator.share,
        specification: specificationType.STANDARD,
    },
    {
        test: () => window.Intent,
        specification: specificationType.VENDOR,
    },
);
