import { connect } from 'react-redux';

import TransactionDialog from '../components/transaction/TransactionDialog';
import {closeTransactionDialog, updateTransaction} from '../actions/TransactionActions';
import {Transaction} from '../models/Transaction';
import {RootState} from '../reducers/rootReducer';
import {selectCloseOnExit} from '../selectors/SettingsSelector';
import {selectAccountCurrencies} from '../selectors/AccountSelector';
import {AccountTreeNode} from "../models/Account";

export interface TransactionEditorState {
    transaction: Transaction;
    visible: boolean;
    closeOnExit: boolean;
    tags: string[];
    accountCurrencies: Record<number, number>;
    assetTree: AccountTreeNode;
    incomeTree: AccountTreeNode;
    expenseTree: AccountTreeNode;
}

const mapStateToProps = (state:RootState):TransactionEditorState => {
    return {
        transaction: state.transaction.editedTransaction,
        visible: state.transaction.transactionDialogVisible,
        closeOnExit: selectCloseOnExit(state),
        tags: state.tag.tags,
        accountCurrencies: selectAccountCurrencies(state),
        assetTree: state.account.assetTree,
        incomeTree: state.account.incomeTree,
        expenseTree: state.account.expenseTree,
    }
}

const mapDispatchToProps= {updateTransaction, closeTransactionDialog};

export type TransactionDialogProps = TransactionEditorState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDialog)
