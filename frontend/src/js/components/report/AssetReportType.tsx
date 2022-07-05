import React, {useState, useRef, useEffect} from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {ReportProps} from "./ReportsPage";
import {reportDatesToParams} from "../../util/ReportUtils";
import {Report} from "../../models/Report";
import { checkApiError, parseJSON} from '../../util/ApiUtils';
import moment from 'moment';

export function AssetReportType(props:ReportProps) {
    const [chartData, setChartData] = useState<Report>({dates: [], series: []});
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const url = `/api/reports/assets/type/${reportDatesToParams(props)}`

    useEffect(() => {
        const container = chartComponentRef.current.container.current;
        container.style.height = '100%';
        container.style.width = '100%';
        chartComponentRef.current.chart.reflow();

        const url = `/api/reports/assets/type/${reportDatesToParams(props)}`

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json: any) {
                const dates = json.dates.map(item => moment(item).format('DD. MMM\' YY'));

                setChartData({
                    dates: dates, series: json.series
                })
            })
            .catch(function () {
            })

    }, [props])

    const options = {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Asset Totals '
      },
      subtitle: {
        text: 'by asset type'
      },
      xAxis: {
          categories: chartData.dates,
      },
      yAxis: {
        title: {
          text: props.primaryCurrencyName
        }
      },
      tooltip: {
        split: true
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
                enabled: true
              }
            }
          }
        }
      },
        series: chartData.series
    }
    return (<HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef}/>)
}

export default AssetReportType;
