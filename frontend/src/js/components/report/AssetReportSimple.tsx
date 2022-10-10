import React from 'react';
import { ReportParams } from '../../api/api';
import AssetReportWidet from './AssetReportWidet';

export function AssetReportSimple(props: ReportParams) {
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

    return (
        <AssetReportWidet
            type="assets/simple"
            params={props}
            options={options}
            primaryCurrencyName={props.primaryCurrencyName}
        />
    );
}

export default AssetReportSimple;
