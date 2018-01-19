<template>
    <div id="app">
        <header>
            <span>POC</span>
        </header>
        <main>
            <button v-on:click="testBrowserInfo">test sending browser info</button>
            <feature v-bind:feature="currentFeature"></feature>
            <features-summary v-bind:features="features"></features-summary>
        </main>
        <footer>
            <control-panel v-bind:current-feature="currentFeature" v-on:next-feature="toNextFeature" v-on:previous-feature="toPreviousFeature"></control-panel>
        </footer>
    </div>
</template>

<script>
import io from 'socket.io-client';
import Feature from './components/Feature';
import ControlPanel from './components/ControlPanel';
import FeaturesSummary from './components/FeaturesSummary';
import features from './features';
import browserInfoService from './browser-info/browser-info.service';

const socket = io('http://localhost:5051');

export default {
    name: 'app',
    components: {
        Feature,
        ControlPanel,
        FeaturesSummary
    },
    data: function () {
        return {
            features: features.get(),
            currentFeature: features.get()[0],
            feauresFixList: features.get().map(feature => feature.id) || [],
            currentFeatureFixIndex: 0
        };
    },
    methods: {
        testBrowserInfo: () => browserInfoService.sendInfo(),
        toNextFeature: function () {
            console.log(this.currentFeatureFixIndex);
            this.feauresFixList.length + 1 >= this.currentFeatureFixIndex + 1
                ? ++this.currentFeatureFixIndex &&
                socket.emit('switch-slide', this.feauresFixList[this.currentFeatureFixIndex])
                : console.log('No features left!');
        },
        toPreviousFeature: function () {
            console.log(this.currentFeatureFixIndex);
            this.currentFeatureFixIndex - 1 >= 0
                ? --this.currentFeatureFixIndex &&
                socket.emit('switch-slide', this.feauresFixList[this.currentFeatureFixIndex])
                : console.log('No features left!');
        }
    },
    created: function () {
        socket.on('connect', () => {
            // todo  check actual state -> send empty message
            console.log('=== connected!');
        });
        socket.on(
            'switch-slide',
            message => {
                this.currentFeature = this.features.find(feature => feature.id === message);
                console.log('=== slide', message);
            }
        );
        socket.on('finish', _ => console.log('=== finish'));

        browserInfoService.sendInfo();
    },
    destroyed: function () { }
};
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
  background-color: #35495e;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: 0.02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
