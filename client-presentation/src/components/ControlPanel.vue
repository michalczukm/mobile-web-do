<template>
    <div>
        <p><b>Current state:</b> {{ presentationState }}</p>
        <p><b>Current feature: </b> {{ currentFeature || 'none' }}</p>
        <hr>
        <button v-on:click="toPreviousFeature">Previous feature</button>
        <button v-on:click="toNextFeature">Next feature</button>
    </div>
</template>

<script>
export default {
    name: 'control-panel',
    props: {
        currentFeature: {
            type: Object,
            required: true
        },
        presentationState: {
            type: String,
            required: false,
            default: 'NEW'
        }
    },
    methods: {
        toNextFeature: function() { this.$emit('next-feature'); },
        toPreviousFeature: function() { this.$emit('previous-feature'); }
    }
};
</script>
