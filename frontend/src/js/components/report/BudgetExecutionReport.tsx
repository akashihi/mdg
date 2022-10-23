import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { BudgetExecutionReport as BudgetExecutionReportType } from '../../api/models/Report';
import { ReportParams } from '../../api/api';
import * as API from '../../api/api';

export function BudgetExecutionReport(props: ReportParams) {
    const [chartData, setChartData] = useState<BudgetExecutionReportType>({
        dates: [],
        actual_income: [],
        actual_expense: [],
        expected_income: [],
        expected_expense: [],
        profit: [],
    });
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        // Compiler is lawfully arguing for the unchecked updates below
        // However as i'm messing with highcharts internal fields,
        // there is no way to convince compiler that everything is correct.
        // eslint-disable-next-line
        // @ts-ignore
        const container = chartComponentRef.current.container.current;
        // eslint-disable-next-line
        // @ts-ignore
        container.style.height = '100%';
        // eslint-disable-next-line
        // @ts-ignore
        container.style.width = '100%';
        // eslint-disable-next-line
        // @ts-ignore
        chartComponentRef.current.chart.reflow();
    });

    useEffect(() => {
        // Compiler is lawfully arguing for the unchecked updates below
        // However as i'm messing with highcharts internal fields,
        // there is no way to convince compiler that everything is correct.
        // eslint-disable-next-line
        // @ts-ignore
        const container = chartComponentRef.current.container.current;
        // eslint-disable-next-line
        // @ts-ignore
        container.style.height = '100%';
        // eslint-disable-next-line
        // @ts-ignore
        container.style.width = '100%';
        // eslint-disable-next-line
        // @ts-ignore
        chartComponentRef.current.chart.reflow();
        (async () => {
            const result = await API.loadBudgetReport(props);
            if (result.ok) {
                setChartData(result.val);
            }
        })();
    }, [props]);
    const options = {
        title: {
            text: 'Budget execution',
        },
        xAxis: {
            categories: chartData.dates,
        },
        yAxis: {
            title: {
                text: props.primaryCurrencyName,
            },
        },
        tooltip: {
            formatter: function () {
                const message = `${this.x} You've earned ${chartData.profit[this.point.index]} ${
                    props.primaryCurrencyName
                }`;
                const income = `Your income was ${chartData.actual_income[this.point.index]} ${
                    props.primaryCurrencyName
                } of expected ${chartData.expected_income[this.point.index]} ${props.primaryCurrencyName}`;
                const incomeDiff = `(${(
                    chartData.actual_income[this.point.index] - chartData.expected_income[this.point.index]
                ).toFixed(2)} ${props.primaryCurrencyName} difference)`;
                const expense = `You spend ${-1 * chartData.actual_expense[this.point.index]} ${
                    props.primaryCurrencyName
                } of expected ${-1 * chartData.expected_expense[this.point.index]} ${props.primaryCurrencyName}`;
                const expenseDiff = `(${(
                    -1 * chartData.actual_expense[this.point.index] -
                    -1 * chartData.expected_expense[this.point.index]
                ).toFixed(2)} ${props.primaryCurrencyName} difference)`;
                return `${message}<BR/>${income}<BR/>${incomeDiff}<BR/>${expense}<BR/>${expenseDiff}`;
            },
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                pointPadding: 0,
            },
        },
        series: [
            {
                name: 'Actual income',
                type: 'column',
                data: chartData.actual_income,
                stack: 'actual',
            },
            {
                name: 'Actual expense',
                type: 'column',
                data: chartData.actual_expense,
                stack: 'actual',
            },
            {
                name: 'Expected income',
                type: 'column',
                data: chartData.expected_income,
                stack: 'expected',
            },
            {
                name: 'Expected expense',
                type: 'column',
                data: chartData.expected_expense,
                stack: 'expected',
            },
            {
                name: 'Profit',
                type: 'spline',
                data: chartData.profit,
            },
        ],
    };
    return <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />;
}

export default BudgetExecutionReport;
