<template>
    <div>
        <strong>Feature: </strong> {{feature.id}}
        <ul>
            <li v-for="(test, index) in testsResult.passed" v-bind:key="index" class="passed">
                <code>{{ test }}</code>
            </li>
        </ul>
        <ul>
            <li v-for="(test, index) in testsResult.failed" v-bind:key="index" class="failed">
                <code>{{ test }}</code>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        feature: {
            type: Object,
            required: true
        }
    },
    computed: {
        testsResult: function() { return this.feature.examine(); }
    }
};
</script>

<style lang="scss" scoped>
.passed {
    border: 1px solid green;
}
.failed {
    border: 1px solid red;
}
</style>
