import { createSelector } from 'reselect';
import moment from 'moment';
import { getBudgets } from './StateGetters';
import { BudgetState } from '../reducers/BudgetReducer';
import { Budget } from '../api/model';

export const getSelectedBudget = createSelector(
    [getBudgets],
    (budgetState: BudgetState): Budget | undefined => budgetState.selectedBudget
);

export const selectSelectedBudgetId = createSelector([getBudgets], (budgetState: BudgetState): number => {
    if (budgetState.selectedBudget === null || budgetState.selectedBudget === undefined) {
        if (budgetState.currentBudget === null || budgetState.currentBudget === undefined) {
            return parseInt(moment().format('YYYYMMDD'));
        } else {
            return budgetState.currentBudget.id;
        }
    } else {
        return budgetState.selectedBudget.id;
    }
});
