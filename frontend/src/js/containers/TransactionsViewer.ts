import { connect } from 'react-redux'

import TransactionsPage from '../components/transaction/TransactionsPage'
import {loadAccountList} from '../actions/AccountActions';
import {loadBudgetInfoById} from '../actions/BudgetEntryActions';
import {loadTotalsReport} from '../actions/ReportActions';
import {RootState} from '../reducers/rootReducer';
import {getCurrentBudgetId} from '../selectors/StateGetters';
import {editTransaction} from '../actions/TransactionActions';
import {Transaction} from "../models/Transaction";

export interface TransactionViewerState {
    currentBudgetId: number|undefined;
    savableTransaction?: Transaction
}

const mapStateToProps = (state: RootState):TransactionViewerState => {
  return {
      currentBudgetId: getCurrentBudgetId(state),
      savableTransaction: state.transaction.savableTransaction
  }
}

const mapDispatchToProps = {loadAccountList, loadBudgetInfoById, loadTotalsReport, editTransaction}

export type TransactionViewerProps = TransactionViewerState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage)
