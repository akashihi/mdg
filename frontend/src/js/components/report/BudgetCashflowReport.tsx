import React, { Fragment, useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as API from '../../api/api';
import * as Model from '../../api/model';
import BudgetSelectorTool from '../../containers/BudgetSelectorTool';

export function BudgetCashflowReport(props: { primaryCurrencyName: string }) {
    const [chartData, setChartData] = useState<Model.BudgetCashflowReport>({
        dates: [],
        actual: { name: '', data: [], custom: [], type: '' },
        expected: { name: '', data: [], custom: [], type: '' },
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

    const onBudgetSelect = (id: number | undefined) => {
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
        if (id != undefined && id != -1) {
            (async () => {
                const result = await API.loadBudgetCashflowReport(id);
                if (result.ok) {
                    setChartData(result.val);
                }
            })();
        }
    };

    const options = {
        title: {
            text: 'Budget cash flow',
        },
        xAxis: {
            categories: chartData.dates,
        },
        yAxis: {
            title: {
                text: props.primaryCurrencyName,
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
                name: 'Actual cash flow',
                type: 'area',
                data: chartData.actual.data,
            },
            {
                name: 'Expected cash flow',
                type: 'line',
                data: chartData.expected.data,
            },
        ],
    };

    return (
        <Fragment>
            <BudgetSelectorTool onChange={onBudgetSelect} />
            <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />
        </Fragment>
    );
}

export default BudgetCashflowReport;
