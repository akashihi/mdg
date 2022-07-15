import { connect } from 'react-redux'

import TransactionsPage from '../components/transaction/TransactionsPage'
import {loadAccountList} from '../actions/AccountActions';
import {loadBudgetInfoById} from '../actions/BudgetEntryActions';
import {loadTotalsReport} from '../actions/ReportActions';
import {RootState} from '../reducers/rootReducer';
import {editTransaction} from '../actions/TransactionActions';
import {Transaction} from '../models/Transaction';
import {loadCurrentBudget} from '../actions/BudgetActions'
import {selectSelectedBudgetId} from "../selectors/BudgetSelector";

export interface TransactionViewerState {
    currentBudgetId: string;
    savableTransaction?: Transaction
}

const mapStateToProps = (state: RootState):TransactionViewerState => {
  return {
      currentBudgetId: selectSelectedBudgetId(state),
      savableTransaction: state.transaction.savableTransaction
  }
}

const mapDispatchToProps = {loadAccountList, loadBudgetInfoById, loadCurrentBudget, loadTotalsReport, editTransaction}

export type TransactionViewerProps = TransactionViewerState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage)
