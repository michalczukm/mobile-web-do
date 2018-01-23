import {
    Doughnut
} from 'vue-chartjs';

export default {
    name: 'doughnut-chart',
    extends: Doughnut,
    props: {
        data: {
            type: Object,
            required: true
        },
        options: {
            type: Object
        }
    },
    mounted() {
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false
        };

        this.renderChart(this.data, ({...defaultOptions, ...this.options}));
    }
};
