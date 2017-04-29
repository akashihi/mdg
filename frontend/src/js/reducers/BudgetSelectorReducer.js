import {
    TOGGLE_BUDGET_SELECTOR,
    GET_BUDGETLIST_REQUEST,
    GET_BUDGETLIST_SUCCESS,
    GET_BUDGETLIST_FAILURE,
    SET_NEWBUDGET_BEGIN,
    SET_NEWBUDGET_END
} from '../constants/Budget'

const initialState = {
    ui: {
        budgetListVisible: false,
        budgetListLoading: false,
        budgetListError: false
    },
    budgetList: [],
    newBudgetValid: false,
    newBudgetError: '',
    newBudgetBegin: undefined,
    newBudgetEnd: undefined
};

function validateBudgetForm(state) {
    if (state.newBudgetBegin===undefined || state.newBudgetEnd===undefined) {
        return {valid: false, error: ''}
    }

    if (state.newBudgetBegin > state.newBudgetEnd) {
        return {valid: false, error: 'Budget should begin before it\'s completion'}
    }

    var oneDay = 24*60*60*1000;
    var days = Math.round((state.newBudgetEnd.getTime() - state.newBudgetBegin.getTime())/oneDay);
    if (days < 1) {
        return {valid: false, error: 'Budget should be at least one full day long'}
    }

    state.budgetList.forEach(b => {
       var attr = b.attributes;
        var tb = new Date(attr.term_beginning);
        var te = new Date(attr.term_end);
        if (tb <= state.newBudgetEnd && te >= state.newBudgetBegin) {
            return {valid: false, error: 'Budget is overlapping with existing budgets'}
        }
    });
    return {valid: true, error:''}
}

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
        case SET_NEWBUDGET_BEGIN:
            var bst = {...state, newBudgetBegin: action.payload};
            var b = validateBudgetForm(bst);
            return {...bst, newBudgetValid: b.valid, newBudgetError: b.error};
        case SET_NEWBUDGET_END:
            var est = {...state, newBudgetEnd: action.payload};
            var e = validateBudgetForm(est);
            return {...est, newBudgetValid: e.valid, newBudgetError: e.error};
        default:
            return state
    }
}
