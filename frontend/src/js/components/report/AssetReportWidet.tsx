import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { checkApiError, parseJSON } from '../../util/ApiUtils';
import { Report } from '../../models/Report';
import moment from 'moment';

export interface AssetReportWidgetProps {
    url: string;
    options: HighchartsReact.Props;
}

export function AssetReportWidget(props: AssetReportWidgetProps) {
    const [chartData, setChartData] = useState<Report>({ dates: [], series: [] });
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        const container = chartComponentRef.current.container.current;
        container.style.height = '100%';
        container.style.width = '100%';
        chartComponentRef.current.chart.reflow();

        fetch(props.url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json: any) {
                const dates = json.dates.map(item => moment(item).format("DD. MMM' YY"));

                setChartData({
                    dates: dates,
                    series: json.series,
                });
            })
            .catch(function () {});
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
