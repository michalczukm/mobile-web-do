<template>
    <div>
        <h2>Welcome at</h2>
        <h1>{{session.name}}</h1>
        <h2>session!</h2>
        <i class="fa fa-5x secondary-color fa-commenting-o" aria-hidden="true"></i>
    </div>
</template>

<script>
    export default {
        name: 'welcome',
        props: {
            session: Object,
            required: true
        }
    };
</script>
