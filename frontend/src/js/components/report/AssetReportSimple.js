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
    this.props.actions.loadSimpleAssetReport()
  }

    render() {
      const options = {
        chart: {
              type: 'area'
          },
          title: {
              text: 'Asset Totals'
          },
          xAxis: {
              type: 'datetime',
          },
          yAxis: {
              title: {
                  text: this.props.currency
              },
              labels: {
                  formatter: function () {
                      return this.value;
                  }
              }
          },
          tooltip: {
              pointFormat: 'You had <b>{point.y:,.0f}</b> in ' + this.props.currency
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
              data: this.props.data
          }]
}
        return (
          <Fragment>
            <HighchartsReact highcharts={Highcharts} options={options} ref={this.chartComponent} />
          </Fragment>
        );
    }
}
