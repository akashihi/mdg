import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ReportsPage from '../components/ReportsPage'
import * as ReportActions from '../actions/ReportActions'

const mapStateToProps = (state) => {
    return {
        simpleAssetReport: state.report.simpleAssetReport,
        assetReportCurrency: state.report.currencyAssetReport,
        assetReportType: state.report.typeAssetReport,
        startDate: state.report.startDate,
        endDate: state.report.endDate,
        granularity: state.report.granularity,
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ReportActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsPage)
