import React, {Component, Fragment} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default class IncomeByAccountWeight extends Component {
  constructor(props) {
    super(props);
     this.chartComponent = React.createRef();
  }

  componentDidMount() {
    const container = this.chartComponent.current.container.current;

    container.style.height = '100%';
    container.style.width = '100%';
    this.chartComponent.current.chart.reflow();
    this.props.actions.loadIncomeWeightAccountReport()
  }

    render() {
      const options = {
            chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Income weight by account'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}% ({point.y:.2f})'
                }
            }
        },
            series: [{
                name: 'Incomes',
                colorByPoint: true,
                data: this.props.data.series
            }]
        }
        return (
          <Fragment>
            <HighchartsReact highcharts={Highcharts} options={options} ref={this.chartComponent} />
          </Fragment>
        );
    }
}
