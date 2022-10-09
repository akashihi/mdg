import { connect } from 'react-redux';

import TransactionsPageFilter from '../components/transaction/TransactionsPageFilter';
import { Currency } from '../api/model';
import { AccountTreeNode } from '../api/models/Account';
import { RootState } from '../reducers/rootReducer';
import { selectActiveCurrencies } from '../selectors/CurrencySelector';
import { selectAccountNames } from '../selectors/AccountSelector';
import { TransactionFilterParams } from '../api/api';

export interface TransactionFilterOwnProps {
    applyFunc: (f: TransactionFilterParams, l: number) => void;
}

export interface TransactionFilterProps extends TransactionFilterOwnProps {
    tags: string[];
    currencies: Currency[];
    assetTree: AccountTreeNode;
    incomeTree: AccountTreeNode;
    expenseTree: AccountTreeNode;
    accountNames: Record<number, string>;
}

const mapStateToProps = (state: RootState, ownProps: TransactionFilterOwnProps): TransactionFilterProps => {
    return {
        tags: state.tag.tags,
        currencies: selectActiveCurrencies(state),
        assetTree: state.account.assetTree,
        incomeTree: state.account.incomeTree,
        expenseTree: state.account.expenseTree,
        accountNames: selectAccountNames(state),
        applyFunc: ownProps.applyFunc,
    };
};

export default connect(mapStateToProps)(TransactionsPageFilter);
