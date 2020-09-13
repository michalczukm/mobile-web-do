<template>
    <div>
        <h1>Summary</h1>
        <h2>What your browser supports?</h2>
        <features-summary v-bind:features="features" />
    </div>
</template>

<script>
import FeaturesSummary from './FeaturesSummary';

export default {
    name: 'session-summary',
    components: {
        FeaturesSummary,
    },
    props: {
        session: {
            type: Object,
            required: true,
        },
        features: {
            type: Array,
            required: true,
        },
    },
};
</script>
