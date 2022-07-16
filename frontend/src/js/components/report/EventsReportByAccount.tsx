import React from 'react';
import { reportDatesToParams } from '../../util/ReportUtils';
import AssetReportWidet from './AssetReportWidet';
import { EventReportProps } from './EventReportCollection';

export function EventsReportByAccount(props: EventReportProps) {
    const url = `/api/reports/${props.type}/events/${reportDatesToParams(props)}`;

    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Income events over time',
        },
        subtitle: {
            text: 'by account',
        },
        yAxis: {
            title: {
                text: props.primaryCurrencyName,
            },
        },
    };
    return <AssetReportWidet url={url} options={options} />;
}

export default EventsReportByAccount;
