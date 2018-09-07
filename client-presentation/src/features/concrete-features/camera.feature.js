import Vue from 'vue';
import {Feature, specificationType} from '../feature';
import {makeExampleId} from './features-utils';

const exampleUsage =
`// grab the stream
navigator.mediaDevices.getUserMedia({constraints: 'video'})
    .then(stream => {
        // direct the stream to the video element
        document.querySelector('video').srcObject = stream;
    });
`;

export default new Feature('camera',
    exampleUsage,
    () => ({
        component: Vue.component(makeExampleId('camera'), {
            template: `<div>
                        <p><button v-on:click="getVideo">Grab video</button></p>
                        <video controls autoplay style="height:180px; width: 240px;"></video>
                    </div>`,
            methods: {
                getUserMedia(options, successCallback, failureCallback) {
                    const api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia;
                    if (api) {
                        return api.bind(navigator)(options, successCallback, failureCallback);
                    }
                },
                getVideo: function () {
                    const constraints = {video: true};
                    this.getUserMedia(constraints, function (stream) {
                        const mediaControl = document.querySelector('video');

                        if ('srcObject' in mediaControl) {
                            mediaControl.srcObject = stream;
                        } else if (navigator.mozGetUserMedia) {
                            mediaControl.mozSrcObject = stream;
                        } else {
                            mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
                        }
                    }, function (err) {
                        alert('Error: ' + err);
                    });
                }
            }
        })
    }), {
        test: () => window.getUserMedia,
        specification: specificationType.STANDARD
    }, {
        test: () => window.webkitGetUserMedia,
        specification: specificationType.VENDOR
    }, {
        test: () => window.mozGetUserMedia,
        specification: specificationType.VENDOR
    }, {
        test: () => window.msGetUserMedia,
        specification: specificationType.VENDOR
    }, {
        test: () => window.mediaDevices,
        specification: specificationType.STANDARD
    }
);
