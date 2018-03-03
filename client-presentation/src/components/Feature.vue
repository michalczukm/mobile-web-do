<template>
    <div>
        <h1>{{feature.id}}</h1>
        <div class="content">
            <i v-bind:class="{
                'fa-thumbs-up success': feature.testsResult.isSuccess,
                'fa-thumbs-down failed': feature.testsResult.isFailure }"
               class="fa fa-4x" aria-hidden="true"></i>
        </div>
        <div class="support">
            <h3>
                <support-status v-bind:status="feature.status"/>
            </h3>
        </div>
        <table>
            <template v-if="feature.testsResult.isSuccess">
                <h4>Your results:</h4>
                <component v-bind:is="feature.runInClientFn().component"></component>
                <ul class="in-browser-results">
                    <li v-for="(info, index) in feature.runInClientFn().infoArray" v-bind:key="index">
                        <code>{{ info }}</code>
                    </li>
                </ul>
                <tr v-for="(testResult, index) in feature.testsResult.passed" v-bind:key="index" class="success">
                    <td>
                        <pre><code>{{testResult.test.toString().trim()}}</code></pre>
                    </td>
                </tr>
            </template>

            <tr v-if="feature.testsResult.isFailure" v-for="(testResult, index) in feature.testsResult.failed" v-bind:key="index" class="failed">
                <td>
                    <pre><code>{{testResult.test.toString().trim()}}</code></pre>
                </td>
            </tr>
        </table>

    </div>
</template>

<script>
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
        }
    };
</script>

<style lang="scss" scoped>
    ul.in-browser-results {
        list-style-type: none;

        li, ol {
            margin: 0;

        }
    }
    .support {
        margin-top: 0.5em;
        padding-top: 2em;
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
</style>
