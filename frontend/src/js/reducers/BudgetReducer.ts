import { createAction, createReducer } from '@reduxjs/toolkit';
import * as Model from '../api/model';

export const StoreCurrentBudget = createAction<Model.Budget | undefined>('StoreCurrentBudget');
export const StoreSelectedBudget = createAction<Model.Budget>('StoreSelectedBudget');

export interface BudgetState {
    currentBudget?: Model.Budget;
    selectedBudget?: Model.Budget;
}

const initialState: BudgetState = {};

export default createReducer(initialState, builder => {
    builder
        .addCase(StoreCurrentBudget, (state, action) => {
            state.currentBudget = action.payload;
            if (state.selectedBudget === undefined) {
                state.selectedBudget = action.payload;
            }
        })
        .addCase(StoreSelectedBudget, (state, action) => {
            state.selectedBudget = action.payload;
        });
});
