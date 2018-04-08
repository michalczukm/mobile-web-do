<template>
    <transition name="slide-fade">
        <div v-bind:class="{'slide-out': !transition, 'slide-in': transition }">
            <feature class="feature " v-bind:feature="currentFeature"/>
            <feature-description class="description" v-bind:feature="currentFeature"/>
        </div>
    </transition>
</template>

<script>
    import Feature from './Feature';
    import FeatureDescription from './FeatureDescription';

    export default {
        name: 'presentation',
        components: {
            Feature,
            FeatureDescription
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
        data: function () {
            return {transition: false};
        },
        computed: {
            currentFeature: function () {
                return this.features.find(feature => feature.id === this.slideFeatureId);
            }
        },
        watch: {
            slideFeatureId: function (value, oldValue) {
                this.transition = !this.transition;
                setTimeout(() => {
                    this.transition = !this.transition;
                    window.scrollTo(0, 0);
                }, 500);
            }
        }
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
    .description {
        display: none;
    }
    @media (min-width: 60rem) {
        .container {
            max-width: 100%
        }
        .feature {
            display: none;
        }
        .description {
            display: block;
        }
    }
</style>

