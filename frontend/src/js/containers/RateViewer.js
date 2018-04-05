import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import RateWidget from '../components/RateWidget'
import * as RateActions from '../actions/RateActions'

const mapStateToProps = (state) => {
    return {
        primaryCurrency: state.setting.primaryCurrency,
        currencies: state.currency.currencyList,
        rates: state.rate.rateList
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(RateActions, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RateWidget)
