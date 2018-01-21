<template>
    <div>
        <feature v-bind:feature="currentFeature"></feature>
    </div>
</template>

<script>
import Feature from './Feature';

export default {
    name: 'presentation',
    components: {
        Feature
    },
    props: {
        features: {
            type: Array,
            required: true
        },
        slideFeatureId: {
            type: String,
            required: true
        }
    },
    computed: {
        currentFeature: function () {
            return this.features.find(feature => feature.id === this.slideFeatureId);
        }
    }
};
</script>
