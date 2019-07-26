import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'

import {momentFormatToDate} from '../util/DateUtil'

import TransactionsPage from '../components/transaction/TransactionsPage'
import * as TransactionActions from '../actions/TransactionActions'
import * as TagActions from '../actions/TagActions'


//State getters
const getPeriodBeginning = state => state.transactionview.get('periodBeginning');
const getPeriodEnd = state => state.transactionview.get('periodEnd');

//Selectors
const getBeginningDate = createSelector(
    [getPeriodBeginning], momentFormatToDate
);
const getEndDate = createSelector(
    [getPeriodEnd], momentFormatToDate
);

const mapStateToProps = (state) => {
    return {
        waiting: state.transaction.get('ui').get('transactionListLoading'),
        error: state.transaction.get('ui').get('transactionListError'),
        assetAccounts: state.account.get('assetAccountList'),
        incomeAccounts: state.account.get('incomeAccountList'),
        expenseAccounts: state.account.get('expenseAccountList'),
        accounts: state.account.get('accountList'),
        transactions: state.transaction.get('transactionList'),
        periodBeginning: getBeginningDate(state),
        periodEnd: getEndDate(state)
    }
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(TransactionActions, dispatch),
        tagActions: bindActionCreators(TagActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsPage)
