<template>
    <div>
        <h1>Welcome to {{session.name}} session</h1>
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
