import { Rate } from '../api/model';
import {createAction, createReducer} from "@reduxjs/toolkit";

export const RatesLoad = createAction('RatesLoad');
export const RatesStore = createAction<Rate[]>('RatesStore');

export interface RateState {
    readonly rateList: Rate[];
    readonly available: boolean;
}

const initialState: RateState = {
    rateList: [],
    available: false,
};

export default createReducer(initialState, (builder) => {
    builder
        .addCase(RatesLoad, (state) => {
            state.available = false;
        })
        .addCase(RatesStore, (state, action) => {
            state.available = true;
            state.rateList = action.payload;
        })
});


