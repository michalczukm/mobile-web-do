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
            <tr v-if="feature.testsResult.isSuccess" v-for="(testResult, index) in feature.testsResult.passed" v-bind:key="index" class="success">
                <td>
                    <pre><code>{{testResult.test.toString().trim()}}</code></pre>
                </td>
            </tr>
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
    .support {
        margin-top: 0.5em;
        padding-top: 2em;
    }
    ul {
        alignment: left;
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
