import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { processApiResponse } from '../../util/ApiUtils';
import { Report } from '../../models/Report';
import moment from 'moment';

export interface AssetReportWidgetProps {
    url: string;
    options: HighchartsReact.Props;
    primaryCurrencyName: string;
}

export function AssetReportWidget(props: AssetReportWidgetProps) {
    const [chartData, setChartData] = useState<Report>({ dates: [], series: [] });
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

        fetch(props.url)
            .then(processApiResponse)
            .then(function (json) {
                const dates = json.dates.map(item => moment(item).format("DD. MMM' YY"));

                setChartData({
                    dates: dates,
                    series: json.series,
                });
            });
    }, [props]);

    const baseOptions = {
        chart: {
            type: 'area',
        },
        title: {
            text: 'Asset Totals ',
        },
        xAxis: {
            categories: chartData.dates,
        },
        tooltip: {
            split: true,
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true,
                        },
                    },
                },
            },
            column: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true,
                        },
                    },
                },
            },
        },
        series: chartData.series,
    };

    const options = { ...baseOptions, ...props.options };
    return <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />;
}

export default AssetReportWidget;
