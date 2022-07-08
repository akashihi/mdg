import { connect } from 'react-redux'

import TransactionsPage from '../components/transaction/TransactionsPage'
import {loadAccountList} from '../actions/AccountActions';
import {loadBudgetInfoById} from '../actions/BudgetEntryActions';
import {loadTotalsReport} from '../actions/ReportActions';
import {RootState} from "../reducers/rootReducer";
import {getCurrentBudgetId} from "../selectors/StateGetters";

export interface TransactionViewerState {
    currentBudgetId: number|undefined;
}

const mapStateToProps = (state: RootState):TransactionViewerState => {
  return {
      currentBudgetId: getCurrentBudgetId(state)
  }
}

const mapDispatchToProps = {loadAccountList, loadBudgetInfoById, loadTotalsReport}

export type TransactionViewerProps = TransactionViewerState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage)
