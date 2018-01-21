<template>
    <div id="app">
        <header>
            <span>POC</span>
        </header>
        <main>
            <button v-on:click="testBrowserInfo">test sending browser info</button>
            <welcome v-if="state == constants.applicationState.WELCOME" v-bind:session="session"></welcome>
            <presentation v-if="state == constants.applicationState.FEATURE" v-bind:features="features" v-bind:slideFeatureId="slideFeatureId"></presentation>
            <session-summary v-if="state == constants.applicationState.SUMMARY" v-bind:session="session" v-bind:features="features"></session-summary>
        </main>
    </div>
</template>

<script>
import io from 'socket.io-client';
import ControlPanel from './components/ControlPanel';
import Summary from './components/SessionSummary';
import Welcome from './components/Welcome';
import Presentation from './components/Presentation';
import { applicationState } from './presentation/presentation.message';
import sessionService from './sessions';
import features from './features';
import browserInfoService from './browser-info/browser-info.service';
import { logger } from './logging/logger';

const socket = io('http://localhost:5051', { query: `sessionId=${sessionService.getCurrentSessionId()}` });

export default {
    name: 'app',
    components: {
        ControlPanel,
        Summary,
        Welcome,
        Presentation
    },
    data: function () {
        return {
            state: applicationState.WELCOME,
            session: {},
            slideFeatureId: '',
            features: features.get(),
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
        this.constants = {
            applicationState: applicationState
        };

        socket.on('connect', () => {
            // todo  check actual state -> send empty message
            logger.info('WS connected');
        });
        socket.on(
            'switch-slide',
            message => {
                switch (message.state) {
                    case applicationState.WELCOME:
                        break;
                    case applicationState.SUMMARY:
                        break;
                    case applicationState.FEATURE:
                        this.slideFeatureId = message.slideFeatureId;
                        break;
                    default:
                        break;
                }
                this.session = message.session;
                this.state = message.state;

                logger.info('WS message:', message);
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
