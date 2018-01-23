<template>
    <div>
        <i class="screen-center fa fa-5x fa-circle-o-notch fa-spin" aria-hidden="true"></i>
        <span class="sr-only">Loading...</span>
    </div>
</template>

<script>
    export default {
        name: 'loading'
    };
</script>

<style lang="scss" scoped>
    .screen-center {
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top: -0.5em;
        margin-left: -0.5em;
    }

</style>
