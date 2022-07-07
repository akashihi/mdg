import { List, Map, Set } from 'immutable'

import moment from 'moment'

import {
  GET_TRANSACTIONLIST_REQUEST,
  GET_TRANSACTIONLIST_COUNT,
  GET_TRANSACTIONLIST_FAILURE,
  TRANSACTION_LIST_SELECT,
  TRANSACTION_LIST_UNSELECT
} from '../constants/Transaction'

const initialState = Map({
  count: 0,
  pageSize: 10,
  pageNumber: 1,
  periodBeginning: moment().subtract(7, 'days'),
  periodEnd: moment(),
  accountFilter: List(),
  tagFilter: List(),
  commentFilter: '',
  selection: Set()
})

export default function transactionViewReducer (state = initialState, action) {
  switch (action.type) {
    case GET_TRANSACTIONLIST_REQUEST:
      return state.set('count', 0)
        .update('selection', s => s.clear())
    case GET_TRANSACTIONLIST_COUNT:
      return state.set('count', action.payload)
    case GET_TRANSACTIONLIST_FAILURE:
      return state.set('count', 0)
        .set('pageNumber', 1)
    case TRANSACTION_LIST_SELECT:
      return state.update('selection', s => s.add(action.payload))
    case TRANSACTION_LIST_UNSELECT:
      return state.update('selection', s => s.delete(action.payload))
    default:
      return state
  }
}
