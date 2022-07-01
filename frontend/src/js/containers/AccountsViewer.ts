import {connect} from 'react-redux'

import AccountsPage from '../components/account/AccountsPage'
import Currency from "../models/Currency";
import Category from "../models/Category";
import {Account, AccountTreeNode} from "../models/Account";
import {RootState} from "../reducers/rootReducer";
import {selectActiveCurrencies, selectPrimaryCurrencyName} from "../selectors/CurrencySelector";
import {
    AccountTotals,
    selectAccountTotals,
    selectAssetAccount
} from "../selectors/AccountSelector";

export interface AccountsPageProps {
    activeCurrencies: Currency[];
    categories: Category[];
    totals: AccountTotals;
    assetAccounts: Account[];
    assetAccountsTree: AccountTreeNode;
    incomeAccountsTree: AccountTreeNode;
    expenseAccountsTree: AccountTreeNode;
    available: boolean
    primaryCurrencyName: string;
}

const mapStateToProps = (state: RootState): AccountsPageProps => {
    return {
        activeCurrencies: selectActiveCurrencies(state),
        categories: state.category.categoryList,
        totals: selectAccountTotals(state),
        assetAccounts: selectAssetAccount(state),
        assetAccountsTree: state.account.assetTree,
        incomeAccountsTree: state.account.incomeTree,
        expenseAccountsTree: state.account.expenseTree,
        available: state.account.available,
        primaryCurrencyName: selectPrimaryCurrencyName(state)
    }
}

export default connect(mapStateToProps)(AccountsPage)
