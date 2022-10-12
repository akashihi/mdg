import { loadAccountList } from './AccountActions';

import { Category } from '../api/model';
import { wrap } from './base';
import * as API from '../api/api';
import * as Model from '../api/model';
import { produce } from 'immer';
import { CategoriesLoad, CategoriesStore } from '../reducers/CategoryReducer';
import { NotifyError } from '../reducers/ErrorReducer';

export function loadCategoryList() {
    return wrap(async dispatch => {
        dispatch(CategoriesLoad());
        const result = await API.listCategories();
        if (result.ok) {
            dispatch(CategoriesStore(result.val));
            await dispatch(loadAccountList());
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}

export function updateCategory(category: Category) {
    return wrap(async dispatch => {
        dispatch(CategoriesLoad());

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
        dispatch(CategoriesLoad());

        await API.deleteCategory(id);
        await dispatch(loadCategoryList());
    });
}
