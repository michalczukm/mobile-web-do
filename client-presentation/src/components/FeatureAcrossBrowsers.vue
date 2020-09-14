<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Browser</th>
                    <th>OS</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="({ browser, system, status }, index) in tableData" v-bind:key="index">
                    <td>{{ browser }}</td>
                    <td>{{ system }}</td>
                    <td><support-status v-bind:status="status"></support-status></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import SupportStatus from './SupportStatus.vue';
import groupby from 'lodash.groupby';
import sortby from 'lodash.sortby';

export default {
    name: 'feature-across-browsers',
    components: {
        SupportStatus,
    },
    props: {
        featureStatuses: {
            type: Array,
            required: true,
        },
    },
    data: () => ({
        tableData: [],
    }),
    watch: {
        featureStatuses: {
            immediate: true,
            handler() {
                this.tableData = sortby(
                    Object.entries(
                        groupby(
                            this.featureStatuses,
                            stat => `${stat.system.family} / ${stat.browser.family}`,
                        ),
                    ).map(([, [firstResult]]) => ({
                        browser: firstResult.browser.family,
                        system: firstResult.system.family,
                        status: firstResult.status,
                    })),
                    [data => data.browser, data => data.system],
                );
            },
        },
    },
};
</script>

<style lang="scss" scoped>
table {
    padding: 5%;
}
</style>
