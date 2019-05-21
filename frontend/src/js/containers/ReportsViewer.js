import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ReportsPage from '../components/report/ReportsPage'
import * as ReportActions from '../actions/ReportActions'

const mapStateToProps = (state) => {
    return {
        simpleAssetReport: state.report.get('simpleAssetReport'),
        assetReportCurrency: state.report.get('currencyAssetReport'),
        assetReportType: state.report.get('typeAssetReport'),
        budgetExecution: state.report.get('budgetExecutionReport'),
        incomeByAccount: state.report.get('incomeByAccount'),
        expenseByAccount: state.report.get('expenseByAccount'),
        incomeByAccountWeight: state.report.get('incomeByAccountWeight'),
        expenseByAccountWeight: state.report.get('expenseByAccountWeight'),
        startDate: state.report.get('startDate'),
        endDate: state.report.get('endDate'),
        granularity: state.report.get('granularity'),
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ReportActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsPage)
