import colorsSet from '../reports/colors-set';
import { supportStatus } from '../../features/support-status';

const mapStatisticsToChartData = (statistics) => {
    return {
        labels: statistics.map(stat => stat.family),
        datasets: [{
            backgroundColor: colorsSet.getColorsSet(),
            data: statistics.map(stat => stat.quantity)
        }]
    };
};

const mapStatusesToChartData = (statuses) => {
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
};

export default {
    mapStatisticsToChartData,
    mapStatusesToChartData
};
