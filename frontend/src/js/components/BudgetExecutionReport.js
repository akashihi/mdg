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
  }

    render() {
      var props = this.props;
      var report = props.budgetExecution;
      const options = {
          title: {
              text: 'Budget execution'
          },
          xAxis: {
              categories: report.dates,
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
              pointFormat: 'You earned <b>{point.y:,.0f}</b>'
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
              data: report.aIncome,
              stack: 'actual'
            },
            {
                name: 'Actual expense',
                type: 'column',
                data: report.aExpense,
                stack: 'actual'
            },
            {
              name: 'Expected income',
              type: 'column',
              data: report.eIncome,
              stack: 'expected'
            },
            {
                name: 'Expected expense',
                type: 'column',
                data: report.eExpense,
                stack: 'expected'
            },
            {
                name: 'Profit',
                type: 'spline',
                data: report.profit
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
