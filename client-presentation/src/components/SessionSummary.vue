<template>
    <div>
        <h1>Take a look at summary</h1>
        <h2>What your browser supports?</h2>
        <features-summary v-bind:features="features"></features-summary>

        <hr/>

        <h2>Take a look at summary of our session</h2>
        <a v-bind:href="session.reportUrl">Report for {{ session.name }}</a>
    </div>
</template>

<script>
import FeaturesSummary from './FeaturesSummary';

export default {
    name: 'session-summary',
    components: {
        FeaturesSummary
    },
    props: {
        session: {
            type: Object,
            required: true
        }
    }
};
</script>

