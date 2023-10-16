import { connect } from 'react-redux';
import {RootState} from "../reducers/rootReducer";
import {OverviewSetting} from "../reducers/SettingReducer";
import Overview from "../components/Overview";

export interface OverviewPageProps {
    overview: OverviewSetting
}

const mapStateToProps = (state: RootState): OverviewPageProps => {
    return {
        overview: state.setting.overview
    }
}

export default connect(mapStateToProps)(Overview)

