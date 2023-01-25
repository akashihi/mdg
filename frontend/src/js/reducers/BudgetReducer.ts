import { createAction, createReducer } from '@reduxjs/toolkit';
import * as Model from '../api/model';
import {loadSelectedBudget} from "../actions/BudgetActions";

export interface BudgetListDTO {
    data: Model.ShortBudget[],
    next: string|undefined,
    left: number|undefined
}

export const StoreCurrentBudget = createAction<Model.Budget | undefined>('StoreCurrentBudget');
export const StoreSelectedBudget = createAction<Model.Budget>('StoreSelectedBudget');

export const StoreLoadedBudgets = createAction<BudgetListDTO>("StoreLoadedBudgets")

export const StoreAdditionalBudgets = createAction<BudgetListDTO>("StoreAdditionalBudgets")

export const AddNewBudget = createAction<Model.ShortBudget>("AddNewBudget")

export const RemoveBudget = createAction<number>("RemoveBudget")

export interface BudgetState {
    currentBudget?: Model.Budget;
    selectedBudget?: Model.Budget;
    budgets: Model.ShortBudget[];
    budgetCursorNext: string | undefined;
    remainingBudgets: number | undefined;
}

const initialState: BudgetState = {budgetCursorNext: undefined, budgets: [], remainingBudgets: undefined};

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
        })
        .addCase(StoreLoadedBudgets, (state, action) => {
            state.budgets = action.payload.data;
            state.budgetCursorNext = action.payload.next;
            state.remainingBudgets = action.payload.left;
        })
        .addCase(StoreAdditionalBudgets, (state, action) => {
            state.budgets = state.budgets.concat(action.payload.data);
            state.budgetCursorNext = action.payload.next;
            state.remainingBudgets = action.payload.left;
        })
        .addCase(AddNewBudget, (state, action) =>{
            state.budgets = [action.payload, ...state.budgets]
        })
        .addCase(RemoveBudget, (state, action) => {
            state.budgets = state.budgets.filter(item => item.id != action.payload)
        });
});
