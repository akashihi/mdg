import { connect } from 'react-redux';

import FinanceOverviewPanel from '../components/report/FinanceOverviewPanel';
import { RootState } from '../reducers/rootReducer';
import { TotalsReport } from '../models/Report';
import { selectPrimaryCurrencyName } from '../selectors/CurrencySelector';

export interface FinanceOverviewPanelProps {
    totals: TotalsReport[];
    primaryCurrency: string;
}

const mapStateToProps = (state: RootState): FinanceOverviewPanelProps => {
    return {
        totals: state.report.totals,
        primaryCurrency: selectPrimaryCurrencyName(state),
    };
};

export default connect(mapStateToProps)(FinanceOverviewPanel);
