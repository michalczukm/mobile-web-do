<template>
    <div id="app">
        <header>
            <span>POC</span>
        </header>
        <main>
            <feature v-for="feature in features" v-bind:key="feature.id" v-bind:feature="feature">
            </feature>
        </main>
    </div>
</template>

<script>
import io from 'socket.io-client';
import Feature from './components/Feature';
import features from './features';
import browserInfoService from './browser-info/browser-info.service';

const socket = io('http://localhost:5051');

export default {
    name: 'app',
    components: {
        Feature
    },
    data: () => ({
        features: features.get()
    }),
    created: function () {
        socket.on('connect', () => {
            // todo  check actual state -> send empty message
            console.log('=== connected!');
        });
        socket.on('switch-slide', (message) => console.log('=== slide', message));
        socket.on('finish', (_) => console.log('=== finish'));

        browserInfoService.sendInfo();
    },
    destroyed: function () {

    }
};
</script>

<style>
body {
    margin: 0;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

main {
    text-align: center;
    margin-top: 40px;
}

header {
    margin: 0;
    height: 56px;
    padding: 0 16px 0 24px;
    background-color: #35495E;
    color: #ffffff;
}

header span {
    display: block;
    position: relative;
    font-size: 20px;
    line-height: 1;
    letter-spacing: .02em;
    font-weight: 400;
    box-sizing: border-box;
    padding-top: 16px;
}
</style>
