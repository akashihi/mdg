import React, {useEffect, useRef, useState} from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {BudgetExecutionReport as BudgetExecutionReportType} from '../../models/Report';
import {ReportProps} from "./ReportsPage";
import {reportDatesToParams} from "../../util/ReportUtils";
import {checkApiError, parseJSON} from '../../util/ApiUtils';
import moment from 'moment';

export function BudgetExecutionReport(props: ReportProps) {
    const [chartData, setChartData] = useState<BudgetExecutionReportType>({
        dates: [],
        actual_income: [],
        actual_expense: [],
        expected_income: [],
        expected_expense: [],
        profit: []
    });
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        const container = chartComponentRef.current.container.current;
        container.style.height = '100%';
        container.style.width = '100%';
        chartComponentRef.current.chart.reflow();
    })

    useEffect(() => {
        const container = chartComponentRef.current.container.current;
        container.style.height = '100%';
        container.style.width = '100%';
        chartComponentRef.current.chart.reflow();

        const url = `/api/reports/budget/execution/${reportDatesToParams(props)}`;
        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json: any) {
                const dates = json.dates.map(item => moment(item).format('DD. MMM\' YY'));

                setChartData({
                    dates: dates,
                    actual_income: json.actual_income,
                    actual_expense: json.actual_expense,
                    expected_income: json.expected_income,
                    expected_expense: json.expected_expense,
                    profit: json.profit
                })

            })
            .catch(function () {
            });

    }, [props]);
    const options = {
        title: {
            text: 'Budget execution'
        },
        xAxis: {
            categories: chartData.dates
        },
        yAxis: {
            title: {
                text: props.primaryCurrencyName
            },
        },
        tooltip: {
            formatter: function() {
                console.log(this)
                return this.x
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointPadding: 0,
            }
        },
        series: [
            {
                name: 'Actual income',
                type: 'column',
                data: chartData.actual_income,
                stack: 'actual'
            },
            {
                name: 'Actual expense',
                type: 'column',
                data: chartData.actual_expense,
                stack: 'actual'
            },
            {
                name: 'Expected income',
                type: 'column',
                data: chartData.expected_income,
                stack: 'expected'
            },
            {
                name: 'Expected expense',
                type: 'column',
                data: chartData.expected_expense,
                stack: 'expected'
            },
            {
                name: 'Profit',
                type: 'spline',
                data: chartData.profit
            }
        ]
    }
    return <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef}/>
}

export default BudgetExecutionReport;
