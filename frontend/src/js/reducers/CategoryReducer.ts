import { Category } from '../api/model';
import { createAction, createReducer } from '@reduxjs/toolkit';
import * as Model from '../api/model';

export const CategoriesLoad = createAction('CategoriesLoad');
export const CategoriesStore = createAction<Model.Category[]>('CategoriesStore');

export interface CategoryState {
    categoryList: Category[];
    available: boolean;
}

const initialState: CategoryState = {
    categoryList: [],
    available: false,
};

export default createReducer(initialState, builder => {
    builder
        .addCase(CategoriesLoad, state => {
            state.available = false;
        })
        .addCase(CategoriesStore, (state, action) => {
            state.available = true;
            state.categoryList = action.payload;
        });
});
