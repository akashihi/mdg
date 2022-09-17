import React from 'react';
import { ReportProps } from './ReportsPage';
import { reportDatesToParams } from '../../util/ReportUtils';
import AssetReportWidet from './AssetReportWidet';

export function AssetReportType(props: ReportProps) {
    const url = `/api/reports/assets/type/${reportDatesToParams(props)}`;

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

    return <AssetReportWidet url={url} options={options} primaryCurrencyName={props.primaryCurrencyName} />;
}

export default AssetReportType;
