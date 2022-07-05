import React from 'react'
import {reportDatesToParams} from "../../util/ReportUtils";
import AssetReportWidet from "./AssetReportWidet";
import {ReportProps} from "./ReportsPage";

export function IncomeReportEventsAccount(props: ReportProps) {
    const url = `/api/reports/income/events/${reportDatesToParams(props)}`;

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Income events over time'
        },
        subtitle: {
            text: 'by account'
        },
        yAxis: {
            title: {
                text: props.primaryCurrencyName
            }
        }
    };
    return <AssetReportWidet url={url} options={options}/>;
}

export default IncomeReportEventsAccount;
