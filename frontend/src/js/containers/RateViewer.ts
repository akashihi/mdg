import {connect} from 'react-redux'

import RateWidget from '../components/RateWidget'
import {selectActiveRatesWithNames} from '../selectors/RateSelector';
import Rate from "../models/Rate";
import {RootState} from "../reducers/rootReducer";

export interface RateViewerState {
    rates: Rate[],
    available: boolean
}

const mapStateToProps = (state: RootState): RateViewerState => {
    return {
        rates: selectActiveRatesWithNames(state),
        available: state.rate.available
    }
}

export default connect(mapStateToProps)(RateWidget)
