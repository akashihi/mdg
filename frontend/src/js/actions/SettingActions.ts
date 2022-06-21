import {Action} from 'redux';

import { checkApiError, parseJSON } from '../util/ApiUtils'

import {SettingActionType} from '../constants/Setting'
import { loadAccountList } from './AccountActions'
import { loadTotalsReport } from './ReportActions'

export interface SettingApiObject {
    'currency.primary': string;
    'ui.transaction.closedialog': string;
    'ui.language': string;
}

export interface SettingAction extends Action {
    payload: Partial<SettingApiObject>;
}

export function loadSettingList () {
  return (dispatch) => {
    dispatch({type: SettingActionType.SettingsLoad,payload: {}})

    fetch('/api/settings')
      .then(parseJSON)
      .then(checkApiError)
      .then(function (data:any) {
          const map = Object.fromEntries(data.settings.map(item => [item.id, item.value]));
        dispatch({type: SettingActionType.StoreSettings, payload: map});
      })
      .catch(function () {
        dispatch({type: SettingActionType.SettingsLoadFail, payload: {}})
      })
  }
}

export function setPrimaryCurrency (currencyId: number) {
  return (dispatch) => {
    dispatch({
      type: SettingActionType.SettingsLoad,
      payload: {}
    })

    const url = '/api/settings/currency.primary'
    const method = 'PUT'
    const setting = { id: 'currency.primary', value: currencyId.toString() }

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/vnd.mdg+json;version=1'
      },
      body: JSON.stringify(setting)
    })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadSettingList()))
      .then(() => dispatch(loadAccountList()))
      .then(() => dispatch(loadTotalsReport()))
      .catch(function (response) {
        dispatch({
          type: SettingActionType.SettingsLoadFail,
          payload: {}
        })
        dispatch(loadAccountList())
      })
  }
}

export function setCloseTransactionDialog(value: boolean) {
  return (dispatch) => {
    dispatch({
      type: SettingActionType.SettingsLoad,
      payload: {}
    })

    const url = '/api/settings/ui.transaction.closedialog'
    const method = 'PUT'
    const setting = { id: 'ui.transaction.closedialog', value: value.toString() }

    fetch(url, {
      method,
      headers: {
          'Content-Type': 'application/vnd.mdg+json;version=1'
      },
      body: JSON.stringify(setting)
    })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadSettingList()))
      .catch(function (response) {
        dispatch({
          type: SettingActionType.SettingsLoadFail,
          payload: {}
        })
      })
  }
}

export function setLanguage (value:string) {
  return (dispatch) => {
    dispatch({
      type: SettingActionType.SettingsLoad,
      payload: true
    })

    const url = '/api/settings/ui.language'
    const method = 'PUT'
    const setting = { id: 'ui.language',value:value }

    fetch(url, {
      method,
      headers: {
          'Content-Type': 'application/vnd.mdg+json;version=1'
      },
      body: JSON.stringify(setting)
    })
      .then(parseJSON)
      .then(checkApiError)
      .then(() => dispatch(loadSettingList()))
      .catch(function (response) {
        dispatch({
          type: SettingActionType.SettingsLoadFail,
          payload: response.json
        })
      })
  }
}

export function reindexTransactions () {
  return (dispatch) => {
    dispatch({
      type: SettingActionType.SettingsLoad,
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
          type: SettingActionType.SettingsLoadFail,
          payload: response.json
        })
      })
  }
}
