<template>
  <div>
      <p v-if="status === constants.supportStatus.STANDARD">standard support</p>
      <p v-if="status === constants.supportStatus.VENDOR_SPECIFIC">vendor specific support</p>
      <p v-if="status === constants.supportStatus.NO_SUPPORT">no support</p>
  </div>
</template>

<script>
import { supportStatus } from '../features/support-status';

export default {
    name: 'support-status',
    props: {
        status: {
            type: String,
            required: true
        }
    },
    created() {
        this.constants = {
            supportStatus: supportStatus
        };
    }
};
</script>
