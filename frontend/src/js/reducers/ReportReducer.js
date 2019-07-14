import {List, Map, OrderedMap} from 'immutable';
import moment from 'moment';

import {
    GET_TOTALSREPORT_REQUEST,
    GET_TOTALSREPORT_SUCCESS,
    GET_TOTALSREPORT_FAILURE,
    GET_BUDGETREPORT_REQUEST,
    GET_BUDGETREPORT_SUCCESS,
    GET_BUDGETREPORT_FAILURE,
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

const initialState = Map({
    totalsReport: List(),
    simpleAssetReport: [],
    currencyAssetReport: Map({dates: List(), series: OrderedMap()}),
    typeAssetReport: Map({dates: List(), series: OrderedMap()}),
    budgetExecutionReport: Map({dates: List(), aIncome: List(), eIncome: List(), aExpense: List(), eExpense: List(), profit: List()}),
    incomeByAccount: Map({dates: List(), series: OrderedMap()}),
    expenseByAccount: Map({dates: List(), series: OrderedMap()}),
    incomeByAccountWeight: Map({date: '', series: List()}),
    expenseByAccountWeight: Map({date: '', series: List()}),
    startDate: moment().subtract(1, 'month'),
    endDate: moment(),
    granularity: 7
});

export default function reportReducer(state = initialState, action) {
    switch (action.type) {
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
            return state.set('currencyAssetReport', Map({dates: List(), series: OrderedMap()}));
        case GET_CURRENCYASSETREPORT_SUCCESS:
            return state.set('currencyAssetReport', action.payload);
        case GET_TYPEASSETREPORT_REQUEST:
        case GET_TYPEASSETREPORT_FAILURE:
            return state.set('typeAssetReport', Map({dates: List(), series: OrderedMap()}));
        case GET_TYPEASSETREPORT_SUCCESS:
            return state.set('typeAssetReport', action.payload);
        case GET_INCOMEEVENTACCOUNTREPORT_REQUEST:
        case GET_INCOMEEVENTACCOUNTREPORT_FAILURE:
            return state.set('incomeByAccount', Map({dates: List(), series: OrderedMap()}));
        case GET_INCOMEEVENTACCOUNTREPORT_SUCCESS:
            return state.set('incomeByAccount', action.payload);
        case GET_EXPENSEEVENTACCOUNTREPORT_REQUEST:
        case GET_EXPENSEEVENTACCOUNTREPORT_FAILURE:
            return state.set('expenseByAccount', Map({dates: List(), series: OrderedMap()}));
        case GET_EXPENSEEVENTACCOUNTREPORT_SUCCESS:
            return state.set('expenseByAccount', action.payload);
        case GET_INCOMEWEIGHTACCOUNTREPORT_REQUEST:
        case GET_INCOMEWEIGHTACCOUNTREPORT_FAILURE:
            return state.set('incomeByAccountWeight', Map({date: '', series: List()}));
        case GET_INCOMEWEIGHTACCOUNTREPORT_SUCCESS:
            return state.set('incomeByAccountWeight', action.payload);
        case GET_EXPENSEWEIGHTACCOUNTREPORT_REQUEST:
        case GET_EXPENSEWEIGHTACCOUNTREPORT_FAILURE:
            return state.set('expenseByAccountWeight', Map({date: '', series: List()}));
        case GET_EXPENSEWEIGHTACCOUNTREPORT_SUCCESS:
            return state.set('expenseByAccountWeight', action.payload);
        case SET_REPORT_STARTDATE:
            return state.set('startDate', action.payload);
        case SET_REPORT_ENDDATE:
            return state.set('endDate', action.payload);
        case SET_REPORT_GRANULARITY:
            return state.set('granularity', action.payload);
        case GET_BUDGETREPORT_REQUEST:
        case GET_BUDGETREPORT_FAILURE:
            return state.set('budgetExecutionReport', Map({dates: List(), aIncome: List(), eIncome: List(), aExpense: List(), eExpense: List(), profit: List()}));
        case GET_BUDGETREPORT_SUCCESS:
            return state.set('budgetExecutionReport', action.payload);
        default:
            return state;
    }
}
