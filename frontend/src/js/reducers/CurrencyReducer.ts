import { Currency } from '../api/model';
import {createAction, createReducer} from "@reduxjs/toolkit";
import * as Model from '../api/model';

export const CurrenciesLoad = createAction('CurrenciesLoad');
export const CurrenciesStore = createAction<Model.Currency[]>('CurrenciesStore');
export const CurrencyStatusUpdate = createAction<Model.Currency>('CurrencyStatusUpdate');

export interface CurrencyState {
    readonly currencies: Array<Currency>;
    readonly available: boolean;
}

const initialState: CurrencyState = {
    currencies: [],
    available: false,
};

export default createReducer(initialState, builder => {
    builder
        .addCase(CurrenciesLoad, state => {
            state.available = false;
        })
        .addCase(CurrenciesStore, (state, action) => {
            state.available = true;
            state.currencies = action.payload;
        })
        .addCase(CurrencyStatusUpdate, (state, action) => {
            state.available = true;
            const pos = state.currencies.findIndex(c => c.id == action.payload.id);
            if (pos !== undefined) {
                state.currencies[pos].active = action.payload.active;
            }
        })
})
