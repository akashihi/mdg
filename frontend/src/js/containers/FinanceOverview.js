import { connect } from 'react-redux'

import FinanceOverviewPanel from '../components/report/FinanceOverviewPanel'

const mapStateToProps = (state) => {
  return {
    currencies: state.get('currency').get('currencies'),
    totals: state.get('report').get('totalsReport'),
    categoryList: state.get('category').get('categoryList'),
    primaryCurrency: state.get('setting').get('primaryCurrency')
  }
}

export default connect(mapStateToProps)(FinanceOverviewPanel)
