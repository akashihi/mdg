import {createSelector} from 'reselect';
import {Map} from 'immutable';
import {getPeriodBeginning, getPeriodEnd, getSelectedTransactions} from './StateGetters';
import {selectTransactions} from './TransactionSelector';
import {momentFormatToDate} from '../util/DateUtil';

export const selectBeginningDate = createSelector(
    [getPeriodBeginning], momentFormatToDate
);
export const selectEndDate = createSelector(
    [getPeriodEnd], momentFormatToDate
);

export const selectMarkedTransactionsTotals = createSelector(
    [getSelectedTransactions, selectTransactions], (selected, transactions) => {
        const selectedTransactions = transactions.filter((item, id) => selected.has(id));
        const change = selectedTransactions.reduce((acc, item) => acc += parseFloat(item.getIn(['totals', 'total'])), 0);

        return Map({
            count: selected.size,
            change: change
        })
    }
);
