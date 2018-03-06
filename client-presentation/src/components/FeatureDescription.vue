<template>
    <div>
        <h1>{{feature.id}}</h1>
        <h2>Usage</h2>
        <pre v-html="exampleUsage"></pre>
    </div>
</template>

<script>
    import Prism from 'prismjs/components/prism-core';
    import 'prismjs/components/prism-clike';
    import 'prismjs/components/prism-javascript';
    import 'prismjs/themes/prism.css';

    export default {
        name: 'feature-description',
        props: {
            feature: {
                type: Object,
                required: true
            }
        },
        computed: {
            exampleUsage: function() {
                return Prism.highlight(this.feature.exampleUsage.trim(), Prism.languages.javascript);
            }
        }
    };
</script>

<style lang="scss" scoped>
    pre {
        white-space: pre-wrap;
        text-align: left;
        padding-left: 0.5em;
        font-size: 1.2em;
    }
</style>
