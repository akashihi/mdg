import {Map} from 'immutable'

import {checkApiError, parseJSON, dataToMap, mapToData} from '../util/ApiUtils'
import {loadAccountList} from './AccountActions'

import {
    GET_CATEGORYLIST_REQUEST,
    CATEGORY_DIALOG_OPEN,
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

export function createCategory() {
    return (dispatch) => {
        dispatch({
            type: CATEGORY_DIALOG_OPEN,
            payload: {
                full: true,
                category: Map({account_type: 'income', priority: 1, name: '', parent_id: -1}),
                id: -1
            }
        })
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

export function editCategory(categoryId) {
    return (dispatch, getState) => {
        const state = getState()
        const categoryList = state.get('category').get('categoryList')
        const category = findCategoryInListById(categoryId, categoryList)
        dispatch({
            type: CATEGORY_DIALOG_OPEN,
            payload: {
                full: false,
                category,
                id: categoryId
            }
        })
    }
}

export function editCategoryCancel() {
    return {
        type: CATEGORY_DIALOG_CLOSE,
        payload: true
    }
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

export function editCategoryDelete() {
    return (dispatch, getState) => {
        dispatch({
            type: CATEGORY_DIALOG_CLOSE,
            payload: true
        })

        const state = getState()
        const id = state.get('category').getIn(['dialog', 'id'])

        dispatch({
            type: GET_CATEGORYLIST_REQUEST,
            payload: true
        })

        let url = '/api/category'
        const method = 'DELETE'
        url = url + '/' + id

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            }
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(() => dispatch(loadCategoryList()))
            .catch(() => dispatch(loadCategoryList()))
    }
}
