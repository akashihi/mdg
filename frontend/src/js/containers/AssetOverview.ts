import { connect } from 'react-redux';

import AssetOverviewPanel from '../components/report/AssetOverviewPanel';
import { RootState } from '../reducers/rootReducer';
import { TotalsReport } from '../api/models/Report';
import { selectPrimaryCurrencyName } from '../selectors/CurrencySelector';

export interface AssetOverviewPanelProps {
    totals: TotalsReport[];
    primaryCurrency: string;
}

const mapStateToProps = (state: RootState): AssetOverviewPanelProps => {
    return {
        totals: state.report.totals,
        primaryCurrency: selectPrimaryCurrencyName(state),
    };
};

export default connect(mapStateToProps)(AssetOverviewPanel);
