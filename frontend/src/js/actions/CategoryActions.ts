import { loadAccountList } from './AccountActions';

import { CategoryActionType } from '../constants/Category';

import { Action } from 'redux';
import { Category } from '../api/model';
import { wrap } from './base';
import * as API from '../api/api';
import * as Model from '../api/model';
import { produce } from 'immer';

export interface CategoryAction extends Action {
    payload: Category[];
}

export function loadCategoryList() {
    return wrap(async dispatch => {
        dispatch({ type: CategoryActionType.CategoriesLoad, payload: {} });
        const result = await API.listCategories();
        if (result.ok) {
            dispatch({
                type: CategoryActionType.CategoriesStore,
                payload: result.val,
            });
            await dispatch(loadAccountList());
        } else {
            dispatch({
                type: CategoryActionType.CategoriesFailure,
                payload: result.val,
            });
        }
    });
}

export function updateCategory(category: Category) {
    return wrap(async dispatch => {
        dispatch({ type: CategoryActionType.CategoriesLoad, payload: {} });

        const updatedCategory: Model.Category = produce(draft => {
            if (category.parent_id === -1) {
                draft.parent_id = category.id;
            }
        })(category);
        await API.saveCategory(updatedCategory);
        await dispatch(loadCategoryList());
    });
}

export function deleteCategory(id: number) {
    return wrap(async dispatch => {
        dispatch({ type: CategoryActionType.CategoriesLoad, payload: {} });

        await API.deleteCategory(id);
        await dispatch(loadCategoryList());
    });
}
