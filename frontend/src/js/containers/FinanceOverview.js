import { connect } from 'react-redux'

import FinanceOverviewPanel from '../components/report/FinanceOverviewPanel'

const mapStateToProps = (state) => {
    return {
        currencies: state.currency.get('currencies'),
        totals: state.report.get('totalsReport'),
        primaryCurrency: state.setting.get('primaryCurrency')
    }
};

export default connect(mapStateToProps)(FinanceOverviewPanel)
