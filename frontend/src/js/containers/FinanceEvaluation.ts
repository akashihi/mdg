import { connect } from 'react-redux';

import FinanceEvaluationPanel from '../components/report/FinanceEvaluationPanel';
import { selectPrimaryCurrencyName } from '../selectors/CurrencySelector';
import { RootState } from '../reducers/rootReducer';

export interface FinanceEvaluationPanelState {
    primaryCurrency: string;
}

const mapStateToProps = (state: RootState): FinanceEvaluationPanelState => {
    return {
        primaryCurrency: selectPrimaryCurrencyName(state),
    };
};

const mapDispatchToProps = { reportError };

export type FinanceEvaluationPanelProps = FinanceEvaluationPanelState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(FinanceEvaluationPanel);
