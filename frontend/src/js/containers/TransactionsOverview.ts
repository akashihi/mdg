import { connect } from 'react-redux'

import TransactionsOverviewPanel from '../components/transaction/TransactionsOverviewPanel'
import {EnrichedTransaction} from '../models/Transaction';
import {RootState} from "../reducers/rootReducer";
import {loadLastTransactions} from "../actions/TransactionActions";
import {selectLastTransactions} from "../selectors/TransactionSelector";

export interface TransactionOverviewState {
    transactions: EnrichedTransaction[];
}
const mapStateToProps = (state: RootState):TransactionOverviewState => {
  return {
    transactions: selectLastTransactions(state)
  }
}

const mapDispatchToProps = {loadLastTransactions}

export type TransactionOverviewProps = TransactionOverviewState & typeof mapDispatchToProps

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsOverviewPanel)
