import {TOGGLE_BUDGET_SELECTOR, GET_BUDGETLIST_REQUEST, GET_BUDGETLIST_SUCCESS, GET_BUDGETLIST_FAILURE} from '../constants/Budget'

const initialState = {
    ui: {
        budgetListVisible: false,
        budgetListLoading: false,
        budgetListError: false
    },
    budgetList: []
};

export default function budgetSelector(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_BUDGET_SELECTOR:
            return Object.assign({}, state, {ui: {budgetListVisible: action.payload}});
        case GET_BUDGETLIST_REQUEST:
            return Object.assign({}, state, {ui: {budgetListLoading: true, budgetListError: false}});
        case GET_BUDGETLIST_SUCCESS:
            return Object.assign({}, state, {budgetList: action.payload}, {ui: {budgetListLoading: false, budgetListError: false}});
        case GET_BUDGETLIST_FAILURE:
            return Object.assign({}, state, {budgetList: []}, {ui: {budgetListLoading: false, budgetListError: true}});
        default:
            return state
    }
}
