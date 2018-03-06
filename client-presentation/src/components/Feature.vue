<template>
    <div>
        <h2>{{feature.id}}</h2>
        <div class="content">
            <i v-bind:class="{
                'fa-thumbs-up success': feature.testsResult.isSuccess,
                'fa-thumbs-down failed': feature.testsResult.isFailure }"
               class="fa fa-3x" aria-hidden="true"></i>
        </div>
        <div class="support">
            <h3>
                <support-status v-bind:status="feature.status"/>
            </h3>
        </div>
        <hr/>
        <div>
            <template v-if="feature.testsResult.isSuccess" v-for="(runInClient, runInClientIndex) in [feature.runInClientFn()]">
                <component v-bind:key="runInClientIndex" v-bind:is="runInClient.component"></component>
                <ul v-bind:key="runInClientIndex" class="in-browser-results">
                    <li v-for="(info, index) in runInClient.infoArray" v-bind:key="index">
                        <code class="code-example-result">{{ info }}</code>
                    </li>
                </ul>
            </template>
        </div>
        <table class='code-samples'>
            <tr v-if="feature.testsResult.isSuccess" v-for="(testResult, index) in feature.testsResult.passed" v-bind:key="index" class="success">
                <td>
                    <pre v-html="$options.filters.code(testResult.test)"></pre>
                </td>
            </tr>

            <tr v-if="feature.testsResult.isFailure" v-for="(testResult, index) in feature.testsResult.failed" v-bind:key="index" class="failed">
                <td>
                    <pre v-html="$options.filters.code(testResult.test)"></pre>
                </td>
            </tr>
        </table>

    </div>
</template>

<script>
    import Prism from 'prismjs/components/prism-core';
    import 'prismjs/components/prism-clike';
    import 'prismjs/components/prism-javascript';
    import 'prismjs/themes/prism.css';

    import SupportStatus from './SupportStatus';

    export default {
        name: 'feature',
        components: {
            SupportStatus
        },
        props: {
            feature: {
                type: Object,
                required: true
            }
        },
        computed: {
            testsResult: function () {
                return this.feature.testsResult;
            }
        },
        filters: {
            code: function(value) {
                const removeFirstAndLastLine = (text) => text.replace(/(^.*\r?\n|\n[^\n\r\r]*$)/g, '').trim();
                const removeReturnFromBeginning = (text) => text.replace(/return/g, '').trim();
                const processText = (text) => removeReturnFromBeginning(removeFirstAndLastLine(text));

                return Prism.highlight(processText(value.toString()), Prism.languages.javascript);
            }
        }
    };
</script>

<style lang="scss" scoped>
    table.code-samples {
        table-layout: fixed;
        width: 100%;
        margin-bottom: 10%;

        pre {
            padding-left: 0.5em;
            white-space: pre-wrap;
        }
    }
    ul.in-browser-results {
        list-style-type: none;

        li, ol {
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
