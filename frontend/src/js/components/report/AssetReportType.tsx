import React from 'react';
import { ReportParams } from '../../api/api';
import AssetReportWidet from './AssetReportWidet';

export function AssetReportType(props: ReportParams) {
    const options = {
        subtitle: {
            text: 'by asset type',
        },
        yAxis: {
            title: {
                text: props.primaryCurrencyName,
            },
        },
    };

    return <AssetReportWidet type="assets/type" params={props} options={options} primaryCurrencyName={props.primaryCurrencyName} />;
}

export default AssetReportType;
