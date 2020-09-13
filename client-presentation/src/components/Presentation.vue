<template>
    <div>
        <button v-on:click="toggleDisplayType" class="toggle-display-type">Switch display</button>
        <transition name="slide-fade">
            <div v-bind:class="{ 'slide-out': !transition, 'slide-in': transition }">
                <feature v-if="displayType === 'feature'" v-bind:feature="currentFeature" />
                <feature-description
                    v-if="displayType === 'description'"
                    v-bind:feature="currentFeature"
                />
            </div>
        </transition>
    </div>
</template>

<script>
import Feature from './Feature';
import FeatureDescription from './FeatureDescription';

export default {
    name: 'presentation',
    components: {
        Feature,
        FeatureDescription,
    },
    props: {
        features: {
            type: Array,
            required: true,
        },
        slideFeatureId: {
            type: String,
            required: true,
        },
    },
    methods: {
        toggleDisplayType: function() {
            this.displayType = this.displayType === 'feature' ? 'description' : 'feature';
        },
    },
    data: function() {
        return {
            transition: false,
            displayType: 'feature',
        };
    },
    computed: {
        currentFeature: function() {
            return this.features.find(feature => feature.id === this.slideFeatureId);
        },
    },
    watch: {
        slideFeatureId: function() {
            this.transition = !this.transition;
            setTimeout(() => {
                this.transition = !this.transition;
                window.scrollTo(0, 0);
            }, 500);
        },
    },
};
</script>
<style lang="scss" scoped>
.slide-out {
    transition: 0.5s;
    transform: translate(0%, 0);
}
.slide-in {
    transition: 0.5s;
    opacity: 0;
    transform: translate(100%, 0);
}
.toggle-display-type {
    display: none;
}
@media (min-width: 60rem) {
    .container {
        max-width: 100%;
    }
    .toggle-display-type {
        display: inline-block;
    }
}
</style>
