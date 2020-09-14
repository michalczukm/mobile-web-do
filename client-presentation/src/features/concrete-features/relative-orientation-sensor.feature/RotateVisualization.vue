<template>
    <div class="container">
        <div class="box" v-bind:style="{ transform: `matrix3d(${matrixParams})` }">
            <div class="face front">1</div>
            <div class="face back">2</div>
            <div class="face right">3</div>
            <div class="face left">4</div>
            <div class="face top">5</div>
            <div class="face bottom">6</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'rotate-visualization',
    props: {
        matrixParams: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    margin: 50px;
    display: flex;
    justify-content: center;
}

.box {
    width: 100px;
    height: 100px;
    transform-style: preserve-3d;
}

.face {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: inherit;
    font-size: 60px;
    color: #fff;
}

.front {
    background: rgba(90, 90, 90, 0.7);
    transform: translateZ(50px);
}

.back {
    background: rgba(0, 210, 0, 0.7);
    transform: rotateY(180deg) translateZ(50px);
}

.right {
    background: rgba(210, 0, 0, 0.7);
    transform: rotateY(90deg) translateZ(50px);
}

.left {
    background: rgba(0, 0, 210, 0.7);
    transform: rotateY(-90deg) translateZ(50px);
}

.top {
    background: rgba(210, 210, 0, 0.7);
    transform: rotateX(90deg) translateZ(50px);
}

.bottom {
    background: rgba(210, 0, 210, 0.7);
    transform: rotateX(-90deg) translateZ(50px);
}
</style>
