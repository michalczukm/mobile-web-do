<template>
  <div>
      <ul>
          <li v-for="(feature, index) in features" v-bind:key="index">
                <support-status v-bind:status="feature.status">
                </support-status>
                {{ feature.id }}
          </li>
      </ul>
  </div>
</template>

<script>
import SupportStatus from './SupportStatus';

export default {
    name: 'features-summary',
    components: {
        SupportStatus
    },
    props: {
        features: {
            type: Array,
            required: true
        }
    }
};
</script>
