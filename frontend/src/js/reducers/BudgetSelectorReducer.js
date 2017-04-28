import {TOGGLE_BUDGET_SELECTOR, GET_BUDGETLIST_REQUEST, GET_BUDGETLIST_SUCCESS} from '../constants/Budget'

const initialState = {
    ui: {
        budgetListVisible: false,
        budgetListLoading: true
    },
    budgetList: []
};

export default function budgetSelector(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_BUDGET_SELECTOR:
            return {...state, ui: {budgetListVisible: action.payload}};
        case GET_BUDGETLIST_REQUEST:
            return {...state, ui: {budgetListLoading: true}};
        case GET_BUDGETLIST_SUCCESS:
            return {...state, budgetList: action.payload, ui: {budgetListLoading: false}};
        default:
            return state
    }
}
