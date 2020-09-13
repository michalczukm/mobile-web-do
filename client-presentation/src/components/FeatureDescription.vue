<template>
    <div>
        <h1>{{ feature.id }}</h1>
        <loading v-if="isLoading" />
        <template v-else>
            <h2>
                <b>{{ featureResult.clientsQuantity }}</b
                >&nbsp;<i class="fa primary-color fa-user-o"></i> attented!
            </h2>
            <div key="foo" class="charts-container">
                <div class="chart">
                    <h3>Operating systems</h3>
                    <doughnut-chart key="operating-systems" v-bind:data="operatingSystemsStats" />
                </div>

                <div class="chart">
                    <h3>Browsers</h3>
                    <doughnut-chart v-bind:data="browsersStats" />
                </div>
                <div class="chart">
                    <h3>Your results</h3>
                    <doughnut-chart v-bind:data="statusesStats" />
                </div>
            </div>
        </template>

        <hr />

        <h2>Usage</h2>
        <pre v-html="exampleUsage"></pre>
    </div>
</template>

<script>
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import Loading from './Loading';
import sessionService from '../sessions';
import DoughnutChart from './reports/DoughnutChart';
import chartDataService from './reports/chart-data.service';
import { logger } from '../logging';

export default {
    name: 'feature-description',
    components: {
        Loading,
        DoughnutChart,
    },
    data: function() {
        return {
            featureResult: null,
            isLoading: true,
            operatingSystemsStats: [],
            browsersStats: [],
            statusesStats: [],
        };
    },
    props: {
        feature: {
            type: Object,
            required: true,
        },
    },
    computed: {
        exampleUsage: function() {
            return Prism.highlight(this.feature.exampleUsage.trim(), Prism.languages.javascript);
        },
    },
    methods: {
        mapStatisticsToChartData: function(statistics) {
            return chartDataService.mapStatisticsToChartData(statistics);
        },
        mapStatusesToChartData: function(statuses) {
            return chartDataService.mapStatusesToChartData(statuses);
        },
    },
    watch: {
        feature: {
            immediate: true,
            handler() {
                sessionService
                    .getFeatureResult(this.feature.id)
                    .then(result => {
                        this.featureResult = result;
                        this.isLoading = false;
                        this.browsersStats = this.mapStatisticsToChartData(
                            this.featureResult.browsers,
                        );
                        this.operatingSystemsStats = this.mapStatisticsToChartData(
                            this.featureResult.systems,
                        );
                        this.statusesStats = this.mapStatusesToChartData(
                            this.featureResult.result.statuses,
                        );
                    })
                    .catch(reason =>
                        logger.error(`Cannot load feature '${this.feature.id}' results`, reason),
                    );
            },
        },
    },
};
</script>

<style lang="scss" scoped>
pre {
    white-space: pre-wrap;
    text-align: left;
    padding-left: 0.5em;
    font-size: 1.6em;
    margin-bottom: 3em;
}
</style>
