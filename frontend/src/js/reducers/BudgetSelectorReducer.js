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
    var ui = state.ui;
    switch (action.type) {
        case TOGGLE_BUDGET_SELECTOR:
            ui = {...ui, budgetListVisible: action.payload};
            return {...state, ui: ui};
        case GET_BUDGETLIST_REQUEST:
            ui = {...ui, budgetListLoading: true, budgetListError: false};
            return {...state, ui: ui};
        case GET_BUDGETLIST_SUCCESS:
            ui = {...ui, budgetListLoading: false, budgetListError: false};
            return {...state, budgetList: action.payload, ui: ui};
        case GET_BUDGETLIST_FAILURE:
            ui = {...ui, budgetListLoading: false, budgetListError: true};
            return {...state, budgetList: [], ui: ui};
        default:
            return state
    }
}
