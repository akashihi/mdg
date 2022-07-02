import React, {Fragment, useEffect, useRef, useState} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {ReportProps} from './ReportsPage';
import {reportDatesToParams} from '../../util/ReportUtils';
import { checkApiError, parseJSON} from '../../util/ApiUtils';
import moment from 'moment';

export function AssetReportSimple(props:ReportProps) {
    const [chartData, setChartData] = useState([]);
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    useEffect(() => {
        const container = chartComponentRef.current.container.current;
        container.style.height = '100%';
        container.style.width = '100%';
        chartComponentRef.current.chart.reflow();

        const url = `/api/reports/assets/simple/${reportDatesToParams(props)}`

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json: any) {

                const series = json.report.map((item) => {
                    return [moment(item.date, 'YYYY-MM-DD').valueOf(), item.amount];
                });
                console.log(series);
                setChartData(series);
            })
            .catch(function () {
            })

    }, [props])

    const options = {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Asset Totals'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: props.primaryCurrencyName
            },
            labels: {
                formatter: function () {
                    return this.value
                }
            }
        },
        tooltip: {
            pointFormat: `You had <b>{point.y:,.0f}</b> in ${props.primaryCurrencyName}`
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Total assets',
            data: chartData,
            type: 'area'
        }]
    }

    return (
        <Fragment>
            <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} />
        </Fragment>
    )
}

export default AssetReportSimple;
