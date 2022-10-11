import {createAction, createReducer} from "@reduxjs/toolkit";

export const NotifyError = createAction<string>('NotifyError');

export interface ErrorState {
    errors: string[]
}

const initialState: ErrorState = {
    errors: []
}

export default createReducer(initialState, (builder) => {
  builder
      .addCase(NotifyError, (state, action) => {
          state.errors.push(action.payload);
      })
})
