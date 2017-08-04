import { connect } from 'react-redux'

import FinanceOverviewPanel from '../components/FinanceOverviewPanel'

const mapStateToProps = (state) => {
    return {
        currencies: state.currency.currencyList,
        assetAccounts: state.account.assetAccountList,
    }
};

export default connect(mapStateToProps)(FinanceOverviewPanel)
