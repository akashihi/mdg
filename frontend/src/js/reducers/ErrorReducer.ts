import { createAction, createReducer } from '@reduxjs/toolkit';
import * as Model from '../api/model';

export const NotifyError = createAction<Model.Problem>('NotifyError');

export interface ErrorState {
    error: Model.Problem | undefined;
}

const initialState: ErrorState = {
    error: undefined,
};

export default createReducer(initialState, builder => {
    builder.addCase(NotifyError, (state, action) => {
        state.error = action.payload;
    });
});
