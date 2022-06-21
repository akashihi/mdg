import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ReportsPage from '../components/report/ReportsPage'
import * as ReportActions from '../actions/ReportActions'

const mapStateToProps = (state) => {
  return {
    simpleAssetReport: state.get('report').get('simpleAssetReport'),
    assetReportCurrency: state.get('report').get('currencyAssetReport'),
    assetReportType: state.get('report').get('typeAssetReport'),
    budgetExecution: state.get('report').get('budgetExecutionReport'),
    incomeByAccount: state.get('report').get('incomeByAccount'),
    expenseByAccount: state.get('report').get('expenseByAccount'),
    incomeByAccountWeight: state.get('report').get('incomeByAccountWeight'),
    expenseByAccountWeight: state.get('report').get('expenseByAccountWeight'),
    startDate: state.get('report').get('startDate'),
    endDate: state.get('report').get('endDate'),
    granularity: state.get('report').get('granularity'),
    primaryCurrency: state.get('setting').get('primaryCurrency'),
    currencies: state.get('currency').get('currencies')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(ReportActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsPage)
