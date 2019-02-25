import moment from 'moment';

import {
  GET_TOTALSREPORT_REQUEST,
  GET_TOTALSREPORT_SUCCESS,
  GET_TOTALSREPORT_FAILURE,
  GET_SIMPLEASSETREPORT_REQUEST,
  GET_SIMPLEASSETREPORT_SUCCESS,
  GET_SIMPLEASSETREPORT_FAILURE,
  SET_REPORT_STARTDATE,
  SET_REPORT_ENDDATE,
  SET_REPORT_GRANULARITY,
  GET_CURRENCYASSETREPORT_REQUEST,
  GET_CURRENCYASSETREPORT_SUCCESS,
  GET_CURRENCYASSETREPORT_FAILURE,
  GET_TYPEASSETREPORT_REQUEST,
  GET_TYPEASSETREPORT_SUCCESS,
  GET_TYPEASSETREPORT_FAILURE,
  GET_INCOMEEVENTACCOUNTREPORT_REQUEST,
  GET_INCOMEEVENTACCOUNTREPORT_SUCCESS,
  GET_INCOMEEVENTACCOUNTREPORT_FAILURE
} from '../constants/Report'

import {
    GET_BUDGETLIST_SUCCESS
} from '../constants/Budget'

const initialState = {
   totalsReport: [],
   simpleAssetReport: [],
   currencyAssetReport: {dates:[], series: []},
   typeAssetReport: {dates:[], series: []},
   budgetExecutionReport: {dates: [], aIncome: [], eIncome: [], aExpense: [], eExpense:[], profit:[]},
   incomeByAccount: {dates:[], series: []},
   startDate: moment().subtract(1, 'month'),
   endDate: moment(),
   granularity: 7
};

function prepareBudgetExecutionReport(budgetList) {
  var dates = [];
  var aIncome = [];
  var eIncome = [];
  var aExpense = [];
  var eExpense = [];
  var profit = [];
  var entries = [...budgetList].reverse()
  entries.forEach((item) => {
    var attr = item.attributes;
    dates.push(attr.term_beginning)
    aIncome.push(attr.state.income.actual)
    eIncome.push(attr.state.income.expected)
    aExpense.push(-1 * attr.state.expense.actual)
    eExpense.push(-1 * attr.state.expense.expected)
    profit.push(attr.outgoing_amount.actual-attr.incoming_amount)
  })
  return {dates: dates, aIncome: aIncome, eIncome: eIncome, aExpense: aExpense, eExpense: eExpense, profit: profit}
}

export default function reportReducer(state = initialState, action) {
    switch(action.type) {
        case GET_TOTALSREPORT_REQUEST:
            return {...state, totalsReport: []};
        case GET_TOTALSREPORT_SUCCESS:
            return {...state, totalsReport: action.payload};
        case GET_TOTALSREPORT_FAILURE:
            return {...state, totalsReport: []};
        case GET_SIMPLEASSETREPORT_REQUEST:
        case GET_SIMPLEASSETREPORT_FAILURE:
            return {...state, simpleAssetReport: []}
        case GET_SIMPLEASSETREPORT_SUCCESS:
          return {...state, simpleAssetReport: action.payload}
        case GET_CURRENCYASSETREPORT_REQUEST:
        case GET_CURRENCYASSETREPORT_FAILURE:
            return {...state, currencyAssetReport: {dates:[], series: []}}
        case GET_CURRENCYASSETREPORT_SUCCESS:
          return {...state, currencyAssetReport: action.payload}
        case GET_TYPEASSETREPORT_REQUEST:
        case GET_TYPEASSETREPORT_FAILURE:
            return {...state, typeAssetReport: {dates:[], series: []}}
        case GET_TYPEASSETREPORT_SUCCESS:
          return {...state, typeAssetReport: action.payload}
        case GET_INCOMEEVENTACCOUNTREPORT_REQUEST:
        case GET_INCOMEEVENTACCOUNTREPORT_FAILURE:
            return {...state, incomeByAccount: {dates:[], series: []}}
        case GET_INCOMEEVENTACCOUNTREPORT_SUCCESS:
          return {...state, incomeByAccount: action.payload}
        case SET_REPORT_STARTDATE:
          return {...state, startDate: action.payload}
        case SET_REPORT_ENDDATE:
          return {...state, endDate: action.payload}
        case SET_REPORT_GRANULARITY:
          return {...state, granularity: action.payload}
        case GET_BUDGETLIST_SUCCESS:
          return {...state, budgetExecutionReport: prepareBudgetExecutionReport(action.payload)}
        default:
            return state;
    }
}
