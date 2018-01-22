<template>
  <div>
      <p v-if="status === constants.supportStatus.STANDARD">
          <i class="fa fa-check success"></i>
          standard support
      </p>
      <p v-if="status === constants.supportStatus.VENDOR_SPECIFIC">
          <i class="fa fa-exclamation-triangle warning"></i>
          vendor specific support
        </p>
      <p v-if="status === constants.supportStatus.NO_SUPPORT">
          <i class="fa fa-close failed"></i>
          no support
      </p>
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
