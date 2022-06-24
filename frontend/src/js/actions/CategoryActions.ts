import {Map} from 'immutable'

import {checkApiError, parseJSON, mapToData} from '../util/ApiUtils'
import {loadAccountList} from './AccountActions'

import {
    GET_CATEGORYLIST_REQUEST,
    CATEGORY_DIALOG_CLOSE, CategoryActionType
} from '../constants/Category'

import {Action} from 'redux';
import Category from "../models/Category";

export interface CategoryAction extends Action {
    payload: Category[];
}

export function loadCategoryList() {
    return (dispatch) => {
        dispatch({type: CategoryActionType.CategoriesLoad, payload: {}})

        const url = '/api/categories'

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (data: any) {
                dispatch({
                    type: CategoryActionType.CategoriesStore,
                    payload: data.categories
                })
            })
            .then(() => dispatch(loadAccountList()))
            .catch(function (response) {
                dispatch({
                    type: CategoryActionType.CategoriesStore,
                    payload: response.json
                })
            })
    }
}

export function updateCategory(id, category) {
    return (dispatch) => {
        dispatch({type: CategoryActionType.CategoriesLoad, payload: {}})

        let url = '/api/category'
        let method = 'POST'
        if (id !== -1) {
            url = url + '/' + id
            method = 'PUT'
        }

        category.set('priority', parseInt(category.get('priority')))
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify(mapToData(id, category))
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(() => dispatch(loadCategoryList()))
            .catch(() => dispatch(loadCategoryList()))
    }
}

export function deleteCategory(id: number) {
    return (dispatch) => {
        dispatch({
            type: CategoryActionType.CategoriesLoad,
            payload: true
        })

        const url = `/api/categories/${id}`
        const method = 'DELETE'

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json;version=1'
            }
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(() => dispatch(loadCategoryList()))
            .catch(() => dispatch(loadCategoryList()))
    }
}

function findCategoryInListById(categoryId, categoryList) {
    // Try shortcut
    if (categoryList.has(categoryId)) {
        return categoryList.get(categoryId)
    }

    let result = Map({account_type: 'income', priority: 1, name: ''})
    const getEntry = function (id, category) {
        if (id === categoryId) {
            result = category
        }
        if (category.has('children')) {
            category.get('children').forEach((v, k) => getEntry(k, v))
        }
    }
    categoryList.forEach((v, k) => getEntry(k, v))
    return result
}

export function editCategorySave(newCategory) {
    return (dispatch, getState) => {
        dispatch({
            type: CATEGORY_DIALOG_CLOSE,
            payload: true
        })

        const state = getState()
        const id = state.get('category').getIn(['dialog', 'id'])
        const category = state.get('category').getIn(['dialog', 'category']).merge(newCategory)
        dispatch(updateCategory(id, category))
    }
}
