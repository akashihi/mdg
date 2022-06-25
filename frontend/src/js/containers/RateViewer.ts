import { connect } from 'react-redux'

import RateWidget from '../components/RateWidget'
import {selectActiveRatesWithNames} from '../selectors/RateSelector';
import Rate from "../models/Rate";
import {RootState} from "../reducers/rootReducer";

export interface RateViewerState {
    rates: Rate[]
}

const mapStateToProps = (state: RootState):RateViewerState => {
  return {
    rates: selectActiveRatesWithNames(state)
  }
}

export default connect(mapStateToProps)(RateWidget)
