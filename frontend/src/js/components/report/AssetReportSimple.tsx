import React from 'react';
import { ReportProps } from './ReportsPage';
import { reportDatesToParams } from '../../util/ReportUtils';
import AssetReportWidet from './AssetReportWidet';

export function AssetReportSimple(props: ReportProps) {
    const url = `/api/reports/assets/simple/${reportDatesToParams(props)}`;

    const options = {
        chart: {
            type: 'area',
        },
        title: {
            text: 'Asset Totals',
        },
        yAxis: {
            title: {
                text: props.primaryCurrencyName,
            },
        },
        tooltip: {
            pointFormat: `You had <b>{point.y:,.0f}</b> in ${props.primaryCurrencyName}`,
        },
    };

    return <AssetReportWidet url={url} options={options} primaryCurrencyName={props.primaryCurrencyName}/>;
}

export default AssetReportSimple;
