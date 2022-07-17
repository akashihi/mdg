import { createSelector } from 'reselect';
import moment from 'moment';
import { getBudgets } from './StateGetters';
import { BudgetState } from '../reducers/BudgetReducer';
import { Budget } from '../models/Budget';

export const getSelectedBudget = createSelector(
    [getBudgets],
    (budgetState: BudgetState): Budget => budgetState.selectedBudget
);

export const selectSelectedBudgetId = createSelector([getBudgets], (budgetState: BudgetState): string => {
    if (budgetState.selectedBudget === null) {
        if (budgetState.currentBudget === null) {
            return moment().format('YYYYMMDD');
        } else {
            return budgetState.currentBudget.id;
        }
    } else {
        return budgetState.selectedBudget.id;
    }
});
