import React from 'react';
import { ReportParams } from '../../api/api';

import AssetReportWidet from './AssetReportWidet';

export function AssetReportCurrency(props: ReportParams) {
    const options = {
        subtitle: {
            text: 'by currency',
        },
        tooltip: {
            split: true,
            formatter: function () {
                return this.points.map(p => `${p.point.custom} ${p.series.name} (${p.y} ${props.primaryCurrencyName})`);
            },
        },
    };
    return <AssetReportWidet type="assets/currency" params={props} options={options} primaryCurrencyName={props.primaryCurrencyName} />;
}

export default AssetReportCurrency;
