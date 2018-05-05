<template>
    <div id="app">
        <header>
            <span>The power of <i class="fa fa-mobile"></i> web browsers</span>
        </header>
        <main>
            <loading v-if="state === constants.applicationState.LOADING" />

            <transition name="slide" v-on:before-leave="scrollToTop">
                <not-found v-if="state === constants.applicationState.NO_SESSION"/>
                <welcome v-if="state === constants.applicationState.WELCOME" v-bind:session="session"/>
                <presentation v-if="state === constants.applicationState.FEATURE" v-bind:features="features"
                              v-bind:slideFeatureId="slideFeatureId"/>
                <session-summary v-if="state === constants.applicationState.SUMMARY" v-bind:session="session"
                                 v-bind:features="features"/>
                <session-report v-if="state === constants.applicationState.CLOSED"
                                v-bind:session="session"/>
            </transition>
        </main>
        <footer>
            <a href="https://twitter.com/michalczukm" ref="noreferrer" target="_blank">
                <i class="fa fa-twitter" aria-hidden="true"></i>&nbsp;michalczukm
            </a>
            <span class="cookies">
                This page use cookies
            </span>
        </footer>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import ControlPanel from './components/ControlPanel';
    import SessionSummary from './components/SessionSummary';
    import Welcome from './components/Welcome';
    import NotFound from './components/NotFound';
    import Loading from './components/Loading';
    import Presentation from './components/Presentation';
    import SessionReport from './components/SessionReport';
    import {applicationState} from './presentation/presentation.message';
    import sessionService from './sessions';
    import features from './features';
    import browserInfoService from './browser-info/browser-info.service';
    import {logger} from './logging/logger';
    import configuration from './configuration';

    const socket = io(configuration.wsUrl, {query: `sessionId=${sessionService.getCurrentSessionId()}`});

    export default {
        name: 'app',
        components: {
            ControlPanel,
            SessionSummary,
            Welcome,
            Presentation,
            SessionReport,
            NotFound,
            Loading
        },
        data: function () {
            return {
                state: applicationState.LOADING,
                session: {},
                slideFeatureId: '',
                features: features.get(),
                feauresFixList: features.get().map(feature => feature.id) || [],
                currentFeatureFixIndex: 0
            };
        },
        created: function () {
            this.constants = {
                applicationState: applicationState
            };

            const connect = () => {
                socket.on('connect', () => {
                    // todo  check actual state -> send empty message
                    logger.info('WS connected');
                });
                socket.on(
                    'switch-slide',
                    message => {
                        switch (message.state) {
                            case applicationState.WELCOME:
                            case applicationState.SUMMARY:
                            case applicationState.CLOSED:
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

                browserInfoService.sendInfo()
                    .then(() => sessionService.sendClientSessionResults())
                    .catch(reason => logger.error('Sending client data for session failed', reason));
            };

            // do not connect to WS if no no session
            sessionService.getCurrentSession()
                .then(() => connect())
                .catch(reason => {
                    logger.error('Fetching session results failed', reason);
                    this.state = applicationState.NO_SESSION;
                });
        },
        methods: {
            scrollToTop: () => window.scrollTo(0, 0)
        },
        destroyed: function () {
            socket.disconnect();
        }
    };
</script>

<style lang="scss">
    $primary: #7300e8;
    $secondary: #0073d1;
    $body: #777;

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
        margin-top: 1.5em;
    }

    header {
        margin: 0;
        height: 3em;
        text-align: center;
        background-color: $primary;
        color: #ffffff;
    }

    footer {
        position: fixed;
        bottom: 0px;
        width: 100%;
        border-top: $primary solid 1px;
        padding: 0 16px 0 24px;
        text-decoration: none;
        background-color: white;

        .cookies {
            float: right;
            color: $body;
            font-size: 0.7em;
            display: inline-block
        }
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

    .success {
        color: #97d100;
    }

    .failed {
        color: #e85e39;
    }

    .warning {
        color: #e8ab19;
    }

    .primary-color {
        color: $primary;
    }

    .secondary-color {
        color: $secondary;
    }

    .slide-leave-active,
    .slide-enter-active {
        transition: 1s;
        position: relative;
    }

    .slide-enter {
        position: absolute;
        transform: translate(100%, 0);
    }

    .slide-enter-to {
        transform: translate(0%, 0);
    }

    .slide-leave {
        transform: translate(0%, 0);
    }

    .slide-leave-to {
        position: absolute;
        transform: translate(-100%, 0);
    }

    .charts-container {
        .chart {
            border-bottom: 1px solid $secondary;
            padding-top: 30px;
            padding-bottom: 30px;
        }

        .chart-last {
            border-bottom: 0px;
        }
    }

    @media (min-width: 60rem) {
        .charts-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
        }
        .chart {
            border: 1px solid $secondary;
            margin: 0.5em;
        }
    }
</style>
