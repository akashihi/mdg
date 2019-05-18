import {List, Map} from 'immutable';
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
  GET_INCOMEEVENTACCOUNTREPORT_FAILURE,
  GET_EXPENSEEVENTACCOUNTREPORT_REQUEST,
  GET_EXPENSEEVENTACCOUNTREPORT_SUCCESS,
  GET_EXPENSEEVENTACCOUNTREPORT_FAILURE,
  GET_INCOMEWEIGHTACCOUNTREPORT_REQUEST,
  GET_INCOMEWEIGHTACCOUNTREPORT_SUCCESS,
  GET_INCOMEWEIGHTACCOUNTREPORT_FAILURE,
  GET_EXPENSEWEIGHTACCOUNTREPORT_REQUEST,
  GET_EXPENSEWEIGHTACCOUNTREPORT_SUCCESS,
  GET_EXPENSEWEIGHTACCOUNTREPORT_FAILURE
} from '../constants/Report'

import {
    GET_BUDGETLIST_SUCCESS
} from '../constants/Budget'

const initialState = Map({
   totalsReport: List(),
   simpleAssetReport: [],
   currencyAssetReport: {dates:[], series: []},
   typeAssetReport: {dates:[], series: []},
   budgetExecutionReport: {dates: [], aIncome: [], eIncome: [], aExpense: [], eExpense:[], profit:[]},
   incomeByAccount: {dates:[], series: []},
   expenseByAccount: {dates:[], series: []},
   incomeByAccountWeight: {date:'', series: []},
   expenseByAccountWeight: {date:'', series: []},
   startDate: moment().subtract(1, 'month'),
   endDate: moment(),
   granularity: 7
});

function prepareBudgetExecutionReport(/*budgetList*/) {
  var dates = [];
  var aIncome = [];
  var eIncome = [];
  var aExpense = [];
  var eExpense = [];
  var profit = [];
  return {dates: dates, aIncome: aIncome, eIncome: eIncome, aExpense: aExpense, eExpense: eExpense, profit: profit}
}

export default function reportReducer(state = initialState, action) {
    switch(action.type) {
        case GET_TOTALSREPORT_REQUEST:
        case GET_TOTALSREPORT_FAILURE:
            return state.set('totalsReport', List());
        case GET_TOTALSREPORT_SUCCESS:
            return state.set('totalsReport', List(action.payload));
        case GET_SIMPLEASSETREPORT_REQUEST:
        case GET_SIMPLEASSETREPORT_FAILURE:
            return state.set('simpleAssetReport', []);
        case GET_SIMPLEASSETREPORT_SUCCESS:
            return state.set('simpleAssetReport', action.payload);
        case GET_CURRENCYASSETREPORT_REQUEST:
        case GET_CURRENCYASSETREPORT_FAILURE:
            return state.set('currencyAssetReport', {dates:[], series: []});
        case GET_CURRENCYASSETREPORT_SUCCESS:
            return state.set('currencyAssetReport', action.payload);
        case GET_TYPEASSETREPORT_REQUEST:
        case GET_TYPEASSETREPORT_FAILURE:
            return state.set('typeAssetReport', {dates:[], series: []});
        case GET_TYPEASSETREPORT_SUCCESS:
            return state.set('typeAssetReport', action.payload);
        case GET_INCOMEEVENTACCOUNTREPORT_REQUEST:
        case GET_INCOMEEVENTACCOUNTREPORT_FAILURE:
            return state.set('incomeByAccount', {dates:[], series: []});
        case GET_INCOMEEVENTACCOUNTREPORT_SUCCESS:
            return state.set('incomeByAccount', action.payload);
        case GET_EXPENSEEVENTACCOUNTREPORT_REQUEST:
        case GET_EXPENSEEVENTACCOUNTREPORT_FAILURE:
            return state.set('expenseByAccount', {dates:[], series: []});
        case GET_EXPENSEEVENTACCOUNTREPORT_SUCCESS:
            return state.set('expenseByAccount', action.payload);
        case GET_INCOMEWEIGHTACCOUNTREPORT_REQUEST:
        case GET_INCOMEWEIGHTACCOUNTREPORT_FAILURE:
            return state.set('incomeByAccountWeight', {date:'', series: []});
        case GET_INCOMEWEIGHTACCOUNTREPORT_SUCCESS:
            return state.set('incomeByAccountWeight', action.payload);
        case GET_EXPENSEWEIGHTACCOUNTREPORT_REQUEST:
        case GET_EXPENSEWEIGHTACCOUNTREPORT_FAILURE:
            return state.set('expenseByAccountWeight', {date:'', series: []});
        case GET_EXPENSEWEIGHTACCOUNTREPORT_SUCCESS:
            return state.set('expenseByAccountWeight', action.payload);
        case SET_REPORT_STARTDATE:
            return state.set('startDate', action.payload);
        case SET_REPORT_ENDDATE:
            return state.set('endDate', action.payload);
        case SET_REPORT_GRANULARITY:
            return state.set('granularity', action.payload);
        case GET_BUDGETLIST_SUCCESS:
            return state.set('budgetExecutionReport', prepareBudgetExecutionReport(action.payload));
        default:
            return state;
    }
}
