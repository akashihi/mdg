import { checkApiError, parseJSON } from '../util/ApiUtils';
import { loadAccountList } from './AccountActions';

import { CategoryActionType } from '../constants/Category';

import { Action } from 'redux';
import Category from '../models/Category';
import { produce } from 'immer';
import { CategoryState } from '../reducers/CategoryReducer';

export interface CategoryAction extends Action {
    payload: Category[];
}

export function loadCategoryList() {
    return dispatch => {
        dispatch({ type: CategoryActionType.CategoriesLoad, payload: {} });

        const url = '/api/categories';

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (data: any) {
                dispatch({
                    type: CategoryActionType.CategoriesStore,
                    payload: data.categories,
                });
            })
            .then(() => dispatch(loadAccountList()))
            .catch(function (response) {
                dispatch({
                    type: CategoryActionType.CategoriesStore,
                    payload: response.json,
                });
            });
    };
}

export function updateCategory(category: Category) {
    return dispatch => {
        dispatch({ type: CategoryActionType.CategoriesLoad, payload: {} });

        let url = '/api/categories';
        let method = 'POST';
        if (category.id !== undefined) {
            url = `/api/categories/${category.id}`;
            method = 'PUT';
        }

        const updatedCategory: CategoryState = produce(draft => {
            if (category.parent_id === -1) {
                draft.parent_id = null;
            }
        })(category);

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json;version=1',
            },
            body: JSON.stringify(updatedCategory),
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(() => dispatch(loadCategoryList()))
            .catch(() => dispatch(loadCategoryList()));
    };
}

export function deleteCategory(id: number) {
    return dispatch => {
        dispatch({ type: CategoryActionType.CategoriesLoad, payload: {} });

        const url = `/api/categories/${id}`;
        const method = 'DELETE';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json;version=1',
            },
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(() => dispatch(loadCategoryList()))
            .catch(() => dispatch(loadCategoryList()));
    };
}
