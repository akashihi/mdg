import {connect} from 'react-redux';

import TransactionsPageFilter from '../components/transaction/TransactionsPageFilter';
import Currency from "../models/Currency";
import {AccountTreeNode} from "../models/Account";
import {RootState} from "../reducers/rootReducer";
import {selectActiveCurrencies} from "../selectors/CurrencySelector";
import {selectAccountNames} from "../selectors/AccountSelector";
import {TransactionFilterParams} from "../components/transaction/TransactionsPage";

export interface TransactionFilterOwnProps {
    applyFunc: (f: TransactionFilterParams, l: number) => void
}

export interface TransactionFilterProps {
    tags: string[];
    currencies: Currency[];
    assetTree: AccountTreeNode;
    incomeTree: AccountTreeNode;
    expenseTree: AccountTreeNode;
    accountNames: Record<number, string>,
    applyFunc: (f: TransactionFilterParams, l: number) => void
}

const mapStateToProps = (state: RootState, ownProps: TransactionFilterOwnProps): TransactionFilterProps => {
    return {
        tags: state.tag.tags,
        currencies: selectActiveCurrencies(state),
        assetTree: state.account.assetTree,
        incomeTree: state.account.incomeTree,
        expenseTree: state.account.expenseTree,
        accountNames: selectAccountNames(state),
        applyFunc: ownProps.applyFunc
    }
}

export default connect(mapStateToProps)(TransactionsPageFilter)
