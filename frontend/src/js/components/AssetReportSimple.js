import React, {Component, Fragment} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default class AssetReportSimple extends Component {
  constructor(props) {
    super(props);
     this.chartComponent = React.createRef();
  }

  componentDidMount() {
    const container = this.chartComponent.current.container.current;

    container.style.height = '100%';
    container.style.width = '100%';
    this.chartComponent.current.chart.reflow();
  }

    render() {
      const options = {
        chart: {
              type: 'area'
          },
          title: {
              text: 'Asset Totals'
          },
          subtitle: {
              text: 'Excluding debt accounts'
          },
          xAxis: {
              allowDecimals: false,
              labels: {
                  formatter: function () {
                      return this.value; // clean, unformatted number for year
                  }
              }
          },
          yAxis: {
              title: {
                  text: 'CZK'
              },
              labels: {
                  formatter: function () {
                      return this.value;
                  }
              }
          },
          tooltip: {
              pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
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
              data: [
                  ['2014-04-01', 0],
                  ['2014-05-01', 200],
                  ['2014-06-01', 400],
              ]
          }]
}
        return (
          <Fragment>
            <HighchartsReact highcharts={Highcharts} options={options} ref={this.chartComponent} />
          </Fragment>
        );
    }
}
