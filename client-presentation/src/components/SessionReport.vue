<template>
    <div>
        <h1>Thanks for participating</h1>
        <h2>Take a look at the overall report</h2>
        <hr>

        <loading v-if="isLoading"/>
        <template v-else>
            <h2>
                <b>{{sessionResult.clientsQuantity}}</b>&nbsp;<i class="fa primary-color fa-user-o"></i> attented!
            </h2>
            <hr>
            <div class="chart">
                <h3>Operating systems</h3>
                <doughnut-chart v-bind:data="mapStatisticsToChartData(sessionResult.systems)"/>
            </div>

            <div class="chart chart-last">
                <h3>Browsers</h3>
                <doughnut-chart v-bind:data="mapStatisticsToChartData(sessionResult.browsers)"/>
            </div>

            <hr>

            <h2>Features we tested</h2>

            <div v-for="(result, index) in sessionResult.results" v-bind:key="index"
                 v-bind:class="{'chart-last': index === sessionResult.results.length - 1}" class="chart">
                <h3>{{result.featureId}}</h3>
                <doughnut-chart v-bind:data="mapStatusesToChartData(result.statuses)"/>
            </div>
        </template>
    </div>
</template>

<script>
    import DoughnutChart from './reports/DoughnutChart';
    import Loading from './Loading';
    import {supportStatus} from '../features/support-status';
    import colorsSet from './reports/colors-set';
    import sessionService from '../sessions';
    import {logger} from '../logging';

    export default {
        name: 'sesion-report',
        components: {
            Loading,
            DoughnutChart
        },
        data: function () {
            return {
                sessionResult: null,
                isLoading: true
            };
        },
        methods: {
            mapStatisticsToChartData: function (statistics) {
                return {
                    labels: statistics.map(stat => stat.family),
                    datasets: [{
                        backgroundColor: colorsSet.getColorsSet(),
                        data: statistics.map(stat => stat.quantity)
                    }]
                };
            },
            mapStatusesToChartData: function (statuses) {
                const refs = [supportStatus.STANDARD, supportStatus.VENDOR_SPECIFIC, supportStatus.NO_SUPPORT];
                const data = refs.map(ref => statuses.filter(status => status === ref).length);

                return {
                    labels: ['Standard', 'Vendor specific', 'No support'],
                    datasets: [
                        {
                            backgroundColor: [
                                '#97D100',
                                '#E8AB19',
                                '#E85E39'
                            ],
                            data: data
                        }
                    ]
                };
            }
        },
        mounted: function () {
            sessionService.getSessionResults()
                .then(result => {
                    this.sessionResult = result;
                    this.isLoading = false;
                })
                .catch(reason => logger.error('Cannot load session results', reason));
        }
    };
</script>

<style lang="scss" scoped>
    .chart {
        border-bottom: 1px solid #0073D1;
        padding-top: 30px;
        padding-bottom: 30px;
    }

    .chart-last {
        border-bottom: 0px;
    }
</style>
