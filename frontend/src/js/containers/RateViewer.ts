import { connect } from 'react-redux'

import RateWidget from '../components/RateWidget'
import {selectActiveRatesWithNames} from '../selectors/RateSelector';
import Rate from "../models/Rate";

export interface RateViewerState {
    rates: Rate[]
}

const mapStateToProps = (state):RateViewerState => {
  return {
    rates: selectActiveRatesWithNames(state)
  }
}

export default connect(mapStateToProps)(RateWidget)
