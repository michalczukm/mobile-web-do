<template>
    <div>
        <transition name="slide-fade">
            <feature class="x" v-bind:feature="currentFeature" v-bind:class="{'slide-out': !transition, 'slide-in': transition }"></feature>
        </transition>
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
    data: function () {
        return { transition: false };
    },
    computed: {
        currentFeature: function () {
            return this.features.find(feature => feature.id === this.slideFeatureId);
        }
    },
    watch: {
        slideFeatureId: function (value, oldValue) {
            this.transition = !this.transition;
            setTimeout(() => { this.transition = !this.transition; }, 500);
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
</style>

