<template>
    <div>
        <h2>{{ feature.id }}</h2>
        <div class="content">
            <i
                v-bind:class="{
                    'fa-thumbs-up success': feature.testsResult.isSuccess,
                    'fa-thumbs-down failed': feature.testsResult.isFailure,
                }"
                class="fa fa-3x"
                aria-hidden="true"
            ></i>
        </div>
        <div class="support">
            <h3>
                <support-status v-bind:status="feature.status" />
            </h3>
        </div>
        <hr />
        <div>
            <template v-if="feature.testsResult.isSuccess">
                <template v-for="(runInClient, runInClientIndex) in [feature.runInClientFn()]">
                    <component
                        v-bind:key="'feature-sample-component-' + runInClientIndex"
                        v-bind:is="runInClient.component"
                    ></component>
                    <ul v-bind:key="runInClientIndex" class="in-browser-results">
                        <li
                            v-for="(info, index) in runInClient.infoArray"
                            v-bind:key="'feature-info-array' + index"
                        >
                            <code class="code-example-result">{{ info }}</code>
                        </li>
                    </ul>
                </template>
            </template>
        </div>
        <table class="code-samples">
            <template v-if="feature.testsResult.isSuccess">
                <tr
                    v-for="(testResult, index) in feature.testsResult.passed"
                    v-bind:key="'code-sample-success-' + index"
                    class="success"
                >
                    <td>{{ formatAsCode(testResult.test) }}</td>
                </tr>
            </template>

            <template v-if="feature.testsResult.isFailure">
                <tr
                    v-for="(testResult, index) in feature.testsResult.failed"
                    v-bind:key="'code-sample-failure-' + index"
                    class="failed"
                >
                    <td>{{ formatAsCode(testResult.test) }}</td>
                </tr>
            </template>
        </table>
    </div>
</template>

<script>
import SupportStatus from './SupportStatus';

export default {
    name: 'feature',
    components: {
        SupportStatus,
    },
    props: {
        feature: {
            type: Object,
            required: true,
        },
    },
    computed: {
        testsResult: function() {
            return this.feature.testsResult;
        },
    },
    methods: {
        formatAsCode: function(value) {
            // test functions are either
            // "() => window.Accelerometer" in dev
            // or "function(){return window.Accelerometer}" in prod
            const getBodyExtractor = text => {
                if (text.indexOf('return') !== -1) {
                    return /return (.*)[;}]/;
                }

                return /\(\) ?=> ?{? ?(?:return)? ([^;\n]*)/;
            };

            const allowSplitByDots = text => {
                // insert zero-width joiner after dots to enable line breaking
                return text.replace('.', '\u200B.');
            };

            const functionBody = getBodyExtractor(value.toString())
                .exec(value)[1]
                .trim();
            return allowSplitByDots(functionBody);
        },
    },
};
</script>

<style lang="scss" scoped>
table.code-samples {
    table-layout: fixed;
    width: 100%;
    margin-bottom: 10%;

    td {
        padding: 1em;
        font-family: monospace;
        overflow-x: scroll;
    }

    .success td {
        background: #97d100;
        color: black;
    }

    .failure td {
        background: #e85e39;
        color: white;
    }
}
ul.in-browser-results {
    list-style-type: none;

    li,
    ol {
        margin: 0;
    }
}
code {
    white-space: pre-wrap;
}
.code-result {
    font-size: 0.9em;
}
.code-example-result {
    font-size: 1.3em;
}
.support {
    margin-top: 0.5em;
    padding-top: 1em;
}
ul {
    align-content: left;
}
code {
    text-align: left;
    text-overflow: ellipsis;
    max-width: 100%;
}
pre {
    margin: 0;
}
td {
    padding: 0;
}
hr {
    margin: 10px;
}
</style>
