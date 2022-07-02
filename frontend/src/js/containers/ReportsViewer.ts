import { connect } from 'react-redux'

import ReportsPage from '../components/report/ReportsPage'
import { selectPrimaryCurrencyName } from '../selectors/CurrencySelector'
import {RootState} from "../reducers/rootReducer";

export interface ReportsViewerProps {
    primaryCurrencyName: string
}

const mapStateToProps = (state: RootState):ReportsViewerProps => {
  return {
      primaryCurrencyName: selectPrimaryCurrencyName(state)
  }
}

export default connect(mapStateToProps)(ReportsPage)
