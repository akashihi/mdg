import {Map} from 'immutable';

import {checkApiError, parseJSON, dataToMap, mapToData} from '../util/ApiUtils';
import {loadAccountList} from './AccountViewerActions';

import {
    GET_CATEGORYLIST_REQUEST,
    GET_CATEGORYLIST_SUCCESS,
    GET_CATEGORYLIST_FAILURE,
    CATEGORY_DIALOG_OPEN,
    CATEGORY_DIALOG_CLOSE
} from '../constants/Category'

export function loadCategoryList() {
    return (dispatch) => {
        dispatch({
            type: GET_CATEGORYLIST_REQUEST,
            payload: true
        });

        var url = '/api/category';

        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(dataToMap)
            .then(function (data) {
                dispatch({
                    type: GET_CATEGORYLIST_SUCCESS,
                    payload: data
                })
            })
            .then(() => dispatch(loadAccountList()))
            .catch(function (response) {
                dispatch({
                    type: GET_CATEGORYLIST_FAILURE,
                    payload: response.json
                })
            });
    }
}

export function updateCategory(id, category) {
    return (dispatch) => {
        dispatch({
            type: GET_CATEGORYLIST_REQUEST,
            payload: true
        });

        var url = '/api/category';
        var method = 'POST';
        if (id !== -1) {
            url = url + '/' + id;
            method = 'PUT';
        }

        category.set('priority', parseInt(category.get('priority')));
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify(mapToData(id, category))
        })
            .then(parseJSON)
            .then(checkApiError)
            .then(()=>dispatch(loadCategoryList()))
            .catch(()=>dispatch(loadCategoryList()))
    }
}

export function createCategory() {
  return(dispatch) => {
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
  //Try shortcut
  if (categoryList.has(categoryId)) {
    return categoryList.get(categoryId)
  }

  var result = Map({account_type: 'income', priority: 1, name: ''})
  var getEntry = function(id, category) {
    if (id === categoryId) {
      result = category
    }
    if (category.has('children')) {
      category.get('children').forEach((v,k) => getEntry(k, v))
    }
  }
  categoryList.forEach((v,k) => getEntry(k, v))
  return result
}

export function editCategory(categoryId) {
  return (dispatch, getState) => {
    var state = getState()
    var categoryList = state.category.get('categoryList')
    var category = findCategoryInListById(categoryId, categoryList)
    dispatch({
        type: CATEGORY_DIALOG_OPEN,
        payload: {
            full: false,
            category: category,
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
        });

        const state = getState();
        const id = state.category.getIn(['dialog', 'id']);
        var category = state.category.getIn(['dialog', 'category']).merge(newCategory);
        dispatch(updateCategory(id, category));
    }
}

export function editCategoryDelete() {
    return (dispatch, getState) => {
        dispatch({
            type: CATEGORY_DIALOG_CLOSE,
            payload: true
        });

        var state = getState();
        var id = state.category.getIn(['dialog', 'id']);

          dispatch({
              type: GET_CATEGORYLIST_REQUEST,
              payload: true
          });

          var url = '/api/category';
          var method = 'DELETE';
          url = url + '/' + id;

          fetch(url, {
              method: method,
              headers: {
                  'Content-Type': 'application/vnd.mdg+json'
              }
          })
              .then(parseJSON)
              .then(checkApiError)
              .then(()=>dispatch(loadCategoryList()))
              .catch(()=>dispatch(loadCategoryList()))
    }
}
