import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Report } from '../../api/model';
import {ReportParams} from "../../api/api";
import * as API from '../../api/api';

export interface AssetReportWidgetProps {
    type: string;
    options: HighchartsReact.Props;
    primaryCurrencyName: string,
    params: ReportParams
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

        (async () => {
            const result = await API.loadAssetReport(props.type, props.params);
            if (result.ok) {
                setChartData(result.val);
            }
        })();
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
