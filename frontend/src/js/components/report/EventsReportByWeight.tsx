import React, { useEffect, useState, useRef } from 'react';
import { reportDatesToParams } from '../../util/ReportUtils';
import Highcharts, { PointOptionsObject } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { checkApiError, parseJSON } from '../../util/ApiUtils';
import moment from 'moment';
import { EventReportProps } from './EventReportCollection';

interface PieData {
    dates: string[];
    data: PointOptionsObject[];
}

export function EventsReportByWeight(props: EventReportProps) {
    const [chartData, setChartData] = useState<PieData>({ dates: [], data: [] });
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        const container = chartComponentRef.current.container.current;
        container.style.height = '100%';
        container.style.width = '100%';
        chartComponentRef.current.chart.reflow();

        const url = `/api/reports/${props.type}/accounts/${reportDatesToParams(props)}`;

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json: any) {
                const dates = json.dates.map(item => moment(item).format("DD. MMM' YY"));

                const data = json.series.map(item => {
                    return { name: item.name, y: item.data[0] };
                });

                setChartData({
                    dates: dates,
                    data: data,
                });
            })
            .catch(function () {});
    }, [props]);

    const options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
        },
        title: {
            text: 'Income weight by account',
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}% ({point.y:.2f})',
                },
            },
        },
        series: [
            {
                name: 'Incomes',
                colorByPoint: true,
                data: chartData.data,
            },
        ],
    };
    return <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />;
}

export default EventsReportByWeight;
