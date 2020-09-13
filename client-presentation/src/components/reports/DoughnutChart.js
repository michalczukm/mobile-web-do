import { Doughnut } from 'vue-chartjs';

export default {
    name: 'doughnut-chart',
    extends: Doughnut,
    props: {
        data: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
        },
    },
    methods: {
        doRender() {
            if (this.$data._chart) {
                this.$data._chart.destroy();
            }

            const defaultOptions = {
                responsive: true,
                maintainAspectRatio: false,
            };

            this.renderChart(this.data, { ...defaultOptions, ...this.options });
        },
    },
    watch: {
        data: {
            handler() {
                this.doRender();
            },
        },
    },
    mounted() {
        this.doRender();
    },
};
