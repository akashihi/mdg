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
    };
    return <AssetReportWidet url={url} options={options} />;
}

export default AssetReportCurrency;
