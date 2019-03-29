import {checkApiError, parseJSON, dataToMap} from '../util/ApiUtils';
import {loadAccountList} from './AccountViewerActions';

import {
    GET_CATEGORYLIST_REQUEST,
    GET_CATEGORYLIST_SUCCESS,
    GET_CATEGORYLIST_FAILURE,
    CATEGORY_DIALOG_OPEN,
    CATEGORY_DIALOG_CHANGE,
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

export function updateCategory(category) {
    return (dispatch) => {
        dispatch({
            type: GET_CATEGORYLIST_REQUEST,
            payload: true
        });

        var url = '/api/category';
        var method = 'POST';
        if (category.hasOwnProperty('id') && category['id'] ) {
            url = url + '/' + category.id;
            method = 'PUT';
        }

        category.attributes.priority = parseInt(category.attributes.priority)
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json'
            },
            body: JSON.stringify({data: category})
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
        category: { attributes: {account_type: 'income', priority: 1, name: ''} }
      }
    })
  }
}

function findCategoryInListById(categoryId, categoryList) {
  var getEntry = function(category) {
    if ('attributes' in category) {
      var attr = category.attributes
    } else {
      attr = category
    }
    // We do not want edited category and it's children in a parents list
    if (attr.id == categoryId) {
      return {id: categoryId, attributes: attr}
    }
    if (attr.children) {
      for (var item of attr.children) {
        var result = getEntry(item)
        if (result != null) {
          return result
        }
      }
    }
    return null
  }
  for (var item of categoryList) {
    var result = getEntry(item)
    if (result != null) {
      return result
    }
  }
  return { attributes: {account_type: 'income', priority: 1, name: ''} }
}

export function editCategory(categoryId) {
  return (dispatch, getState) => {
    var state = getState()
    var categoryList = state.category.categoryList
    var category = findCategoryInListById(categoryId, categoryList)
    dispatch({
        type: CATEGORY_DIALOG_OPEN,
        payload: {
            full: false,
            category: category
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

export function editCategoryChange(category) {
    return {
        type: CATEGORY_DIALOG_CHANGE,
        payload: category
    }
}

export function editCategorySave() {
    return (dispatch, getState) => {
        dispatch({
            type: CATEGORY_DIALOG_CLOSE,
            payload: true
        });

        var state = getState();
        var category = state.category.dialog.category;
        dispatch(updateCategory(category));
    }
}

export function editCategoryDelete() {
    return (dispatch, getState) => {
        dispatch({
            type: CATEGORY_DIALOG_CLOSE,
            payload: true
        });

        var state = getState();
        var category = state.category.dialog.category;

          dispatch({
              type: GET_CATEGORYLIST_REQUEST,
              payload: true
          });

          var url = '/api/category';
          var method = 'DELETE';
          url = url + '/' + category.id;

          fetch(url, {
              method: method,
              headers: {
                  'Content-Type': 'application/vnd.mdg+json'
              },
              body: JSON.stringify({data: category})
          })
              .then(parseJSON)
              .then(checkApiError)
              .then(()=>dispatch(loadCategoryList()))
              .catch(()=>dispatch(loadCategoryList()))
    }
}
