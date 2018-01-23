<template>
  <div>
      <table>
          <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="(feature, index) in features" v-bind:key="index">
                  <td>{{feature.id}}</td>
                  <td><support-status v-bind:status="feature.status"></support-status></td>
              </tr>
          </tbody>
      </table>
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

<style lang="scss" scoped>
table {
    padding: 5%;
}
</style>

