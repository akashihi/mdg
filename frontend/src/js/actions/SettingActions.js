import { checkApiError, dataToMap, parseJSON } from '../util/ApiUtils'

import { GET_SETTING_REQUEST, GET_SETTING_SUCCESS, GET_SETTING_FAILURE } from '../constants/Setting'
import { loadAccountList } from './AccountActions'
import { loadTotalsReport } from './ReportActions'

export function loadSettingList () {
  return (dispatch) => {
    dispatch({
      type: GET_SETTING_REQUEST,
      payload: true
    })

    fetch('/api/setting')
      .then(parseJSON)
      .then(checkApiError)
      .then(dataToMap)
      .then(function (map) {
        dispatch({
          type: GET_SETTING_SUCCESS,
          payload: map
        })
      })
      .catch(function (response) {
        dispatch({
          type: GET_SETTING_FAILURE,
          payload: response
        })
      })
  }
}

export function setPrimaryCurrency (currency_id) {
  return (dispatch) => {
    dispatch({
      type: GET_SETTING_REQUEST,
      payload: true
    })

    const url = '/api/setting/currency.primary'
    const method = 'PUT'
    const setting = { type: 'setting', id: 'currency.primary', attributes: { value: currency_id.toString() } }

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/vnd.mdg+json'
      },
      body: JSON.stringify({ data: setting })
    })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadSettingList()))
      .then(() => dispatch(loadAccountList()))
      .then(() => dispatch(loadTotalsReport()))
      .catch(function (response) {
        dispatch({
          type: GET_SETTING_FAILURE,
          payload: response.json
        })
        dispatch(loadAccountList())
      })
  }
}

export function setCloseTransactionDialog (value) {
  return (dispatch) => {
    dispatch({
      type: GET_SETTING_REQUEST,
      payload: true
    })

    const url = '/api/setting/ui.transaction.closedialog'
    const method = 'PUT'
    const setting = { type: 'setting', id: 'ui.transaction.closedialog', attributes: { value: value.toString() } }

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/vnd.mdg+json'
      },
      body: JSON.stringify({ data: setting })
    })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadSettingList()))
      .catch(function (response) {
        dispatch({
          type: GET_SETTING_FAILURE,
          payload: response.json
        })
      })
  }
}

export function setLanguage (value) {
  return (dispatch) => {
    dispatch({
      type: GET_SETTING_REQUEST,
      payload: true
    })

    const url = '/api/setting/ui.language'
    const method = 'PUT'
    const setting = { type: 'setting', id: 'ui.language', attributes: { value } }

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/vnd.mdg+json'
      },
      body: JSON.stringify({ data: setting })
    })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadSettingList()))
      .catch(function (response) {
        dispatch({
          type: GET_SETTING_FAILURE,
          payload: response.json
        })
      })
  }
}

export function reindexTransactions () {
  return (dispatch) => {
    dispatch({
      type: GET_SETTING_REQUEST,
      payload: true
    })

    const url = '/api/setting/mnt.transaction.reindex'
    const method = 'PUT'

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/vnd.mdg+json'
      }
    })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadSettingList()))
      .catch(function (response) {
        dispatch({
          type: GET_SETTING_FAILURE,
          payload: response.json
        })
      })
  }
}
