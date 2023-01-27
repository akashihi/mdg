import React, { useEffect, useState, useRef } from 'react';
import Highcharts from 'highcharts';
import sunburst from 'highcharts/modules/sunburst.js';
import HighchartsReact from 'highcharts-react-official';
import { EventReportProps } from './EventReportCollection';
import { PieData } from '../../api/model';
import * as API from '../../api/api';

sunburst(Highcharts);

export function EventsReportByWeight(props: EventReportProps) {
    const [chartData, setChartData] = useState<PieData>({ dates: [], data: [] });
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
            const result = await API.loadEventsReport(props.type, props);
            if (result.ok) {
                setChartData(result.val);
            }
        })();
    }, [props]);

    const options = {
        chart: {
            height: '30%',
        },
        title: {
            text: 'Income weight by account',
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b>: <b>{point.value}</b>',
        },
        levels: [
            {
                level: 1,
                levelIsConstant: false,
                dataLabels: {
                    filter: {
                        property: 'outerArcLength',
                        operator: '>',
                        value: 64,
                    },
                },
            },
            {
                level: 2,
                colorByPoint: true,
            },
            {
                level: 3,
                colorVariation: {
                    key: 'brightness',
                    to: -0.5,
                },
            },
            {
                level: 4,
                colorVariation: {
                    key: 'brightness',
                    to: 0.5,
                },
            },
        ],
        series: [
            {
                type: 'sunburst',
                name: 'Incomes',
                colorByPoint: true,
                allowDrillToNode: true,
                cursor: 'pointer',
                data: chartData.data,
                dataLabels: {
                    format: '{point.name}',
                    filter: {
                        property: 'innerArcLength',
                        operator: '>',
                        value: 16,
                    },
                    rotationMode: 'circular',
                },
            },
        ],
    };
    return <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />;
}

export default EventsReportByWeight;
