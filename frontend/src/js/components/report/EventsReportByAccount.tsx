import React from 'react';
import AssetReportWidet from './AssetReportWidet';
import { EventReportProps } from './EventReportCollection';

export function EventsReportByAccount(props: EventReportProps) {
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
    return (
        <AssetReportWidet
            type={`${props.type}/events`}
            params={props}
            options={options}
            primaryCurrencyName={props.primaryCurrencyName}
        />
    );
}

export default EventsReportByAccount;
