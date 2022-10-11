import {createAction, createReducer} from "@reduxjs/toolkit";

export const TagStore = createAction<string[]>('TagStore');

export interface TagState {
    tags: string[];
}

const initialState: TagState = {
    tags: [],
};

export default createReducer(initialState, (builder) => {
    builder
        .addCase(TagStore, (state, action) => {
            state.tags = action.payload
        })
})
