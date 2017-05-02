import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import AccountsPage from '../components/AccountsPage'
import * as CurrencyActions from '../actions/CurrencyActions'


const mapStateToProps = (state) => {
    return {
        currencies: state.currency.currencyList
    }
};

function mapDispatchToProps(dispatch) {
    return {
        currencyActions: bindActionCreators(CurrencyActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountsPage)
