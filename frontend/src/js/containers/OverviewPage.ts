import { connect } from 'react-redux';
import {RootState} from "../reducers/rootReducer";
import {OverviewSetting} from "../reducers/SettingReducer";
import Overview from "../components/Overview";
import {getOverviewPageSetting} from "../selectors/StateGetters";

export interface OverviewPageProps {
    overview: OverviewSetting
}

const mapStateToProps = (state: RootState): OverviewPageProps => {
    return {
        overview: getOverviewPageSetting(state)
    }
}

export default connect(mapStateToProps)(Overview)

