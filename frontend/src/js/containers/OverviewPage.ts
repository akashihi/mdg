import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import Overview from '../components/Overview';
import { getOverviewPageSetting } from '../selectors/StateGetters';
import { OverviewSetting } from '../api/models/Setting';

export interface OverviewPageProps {
    overview: OverviewSetting;
}

const mapStateToProps = (state: RootState): OverviewPageProps => {
    return {
        overview: getOverviewPageSetting(state),
    };
};

export default connect(mapStateToProps)(Overview);
