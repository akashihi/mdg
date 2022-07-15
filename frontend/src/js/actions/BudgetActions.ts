import {Action} from 'redux';
import moment from 'moment';
import { checkApiError, parseJSON, dateToYMD, dataToMap } from '../util/ApiUtils';

import {
    GET_BUDGETLIST_REQUEST,
    GET_BUDGETLIST_SUCCESS,
    GET_BUDGETLIST_FAILURE,
    TOGGLE_HIDDEN_ENTRIES, BudgetActionType
} from '../constants/Budget'

import { loadBudgetInfoById } from './BudgetEntryActions'
import {Budget} from "../models/Budget";

export interface BudgetAction extends Action {
    payload?: Budget
}

export function loadCurrentBudget () {
    return (dispatch) => {
      const id = moment().format('YYYYMMDD');
        fetch(`/api/budgets/${id}`)
            .then(parseJSON)
            .then(checkApiError)
            .then((json: any) => {
               dispatch({type: BudgetActionType.StoreCurrentBudget, payload: json as Budget})
            });
    }
}

export function loadSelectedBudget (id) {
    return (dispatch) => {
        fetch(`/api/budgets/${id}`)
            .then(parseJSON)
            .then(checkApiError)
            .then((json: any) => {
                dispatch({type: BudgetActionType.StoreSelectedBudget, payload: json as Budget})
            });
    }
}

export function toggleHiddenEntries (visible) {
/*  return (dispatch) => {
    dispatch({
      type: TOGGLE_HIDDEN_ENTRIES,
      payload: visible
    })
  }*/
}

export function loadBudgetList () {
  /*return (dispatch) => {
    dispatch({
      type: GET_BUDGETLIST_REQUEST,
      payload: true
    })

    fetch('/api/budget')
      .then(parseJSON)
      .then(checkApiError)
      .then(dataToMap)
      .then(function (map) {
        dispatch({
          type: GET_BUDGETLIST_SUCCESS,
          payload: map
        })
        dispatch(getCurrentBudget())
      })
      .catch(function (response) {
        console.log(response)
        dispatch({
          type: GET_BUDGETLIST_FAILURE,
          payload: response.json
        })
      })
  }*/
}

export function deleteBudget (id) {
  /*return (dispatch) => {
    dispatch({
      type: GET_BUDGETLIST_REQUEST,
      payload: true
    })

    fetch('/api/budget/' + id, { method: 'DELETE' })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadBudgetList()))
      .catch(() => dispatch(loadBudgetList()))
  }*/
}

export function budgetCreate (begin, end) {
  /*return (dispatch) => {
    dispatch({
      type: GET_BUDGETLIST_REQUEST,
      payload: true
    })

    const json = {
      data: {
        type: 'budget',
        attributes: {
          term_beginning: dateToYMD(begin),
          term_end: dateToYMD(end)
        }
      }
    }

    fetch('/api/budget', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.mdg+json'
      },
      body: JSON.stringify(json)
    })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadBudgetList()))
      .catch(() => dispatch(loadBudgetList()))
  }*/
}
