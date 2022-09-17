import React from 'react';
import { ReportProps } from './ReportsPage';
import { reportDatesToParams } from '../../util/ReportUtils';

import AssetReportWidet from './AssetReportWidet';

export function AssetReportCurrency(props: ReportProps) {
    const url = `/api/reports/assets/currency/${reportDatesToParams(props)}`;

    const options = {
        subtitle: {
            text: 'by currency',
        },
        tooltip: {
            split: true,
            formatter: function () {
                return this.points.map(p => `${p.point.custom} ${p.series.name} (${p.y} ${props.primaryCurrencyName})`);
            }
        }
    };
    return <AssetReportWidet url={url} options={options} primaryCurrencyName={props.primaryCurrencyName}/>;
}

export default AssetReportCurrency;
