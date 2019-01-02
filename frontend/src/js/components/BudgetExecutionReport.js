import React, {Component, Fragment} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default class BudgetExecutionReport extends Component {
  constructor(props) {
    super(props);
     this.chartComponent = React.createRef();
  }

  componentDidMount() {
    const container = this.chartComponent.current.container.current;

    container.style.height = '100%';
    container.style.width = '100%';
    this.chartComponent.current.chart.reflow();
    //this.props.actions.loadSimpleAssetReport()
  }

    render() {
      const options = {
          title: {
              text: 'Budget execution'
          },
          xAxis: {
              categories: ['Jun 2018', 'Jul 2018', 'Aug 2018', 'Sep 2018'],
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
              pointFormat: 'You had <b>{point.y:,.0f}</b> in primary currency'
          },
          plotOptions: {
              column: {
                stacking: 'normal'
              }
          },
          series: [
            {
              name: 'Actual income',
              type: 'column',
              data: [70000, 49000, 55000, 48000],
              stack: 'actual'
            },
            {
                name: 'Actual expense',
                type: 'column',
                data: [-52000, -50000, -48000, -48000],
                stack: 'actual'
            },
            {
              name: 'Expected income',
              type: 'column',
              data: [69000, 49000, 57000, 48000],
              stack: 'expected'
            },
            {
                name: 'Expected expense',
                type: 'column',
                data: [-52000, -42000, -48000, -40000],
                stack: 'expected'
            },
            {
                name: 'Profit',
                type: 'spline',
                data: [18000, -1000, 7000, 0]
            }
        ]
}
        return (
          <Fragment>
            <HighchartsReact highcharts={Highcharts} options={options} ref={this.chartComponent} />
          </Fragment>
        );
    }
}
