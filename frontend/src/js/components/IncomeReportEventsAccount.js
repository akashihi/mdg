import React, {Component, Fragment} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default class IncomeReportEventsAccount extends Component {
  constructor(props) {
    super(props);
     this.chartComponent = React.createRef();
  }

  componentDidMount() {
    const container = this.chartComponent.current.container.current;

    container.style.height = '100%';
    container.style.width = '100%';
    this.chartComponent.current.chart.reflow();
    this.props.actions.loadIncomeEventAccountReport()
  }

    render() {
      var series=[]
      for (var entry in this.props.data.series) {
        var seriesData = {
          name: entry,
          data: this.props.data.series[entry]
        }
        series.push(seriesData)
      }

      const options = {
        chart: {
              type: 'column'
          },
          title: {
              text: 'Income events over time'
          },
          subtitle: {
              text: 'by account'
          },
          xAxis: {
              categories: this.props.data.dates.map((item) => item.format('DD. MMM\' YY'))
          },
          yAxis: {
              labels: {
                  formatter: function () {
                      return this.value;
                  }
              }
          },
          tooltip: {
              split: true
          },
          plotOptions: {
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
                              enabled: true
                          }
                      }
                  }
              }
          },
          series: series
        }
        return (
          <Fragment>
            <HighchartsReact highcharts={Highcharts} options={options} ref={this.chartComponent} />
          </Fragment>
        );
    }
}
