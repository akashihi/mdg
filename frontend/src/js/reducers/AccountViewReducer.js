import {
    GET_ACCOUNTLIST_REQUEST,
    GET_ACCOUNTLIST_FAILURE,
    GET_ACCOUNTLIST_SUCCESS,
    TOGGLE_HIDDEN_ACCOUNTS,
    ACCOUNT_DIALOG_OPEN,
    ACCOUNT_DIALOG_CLOSE,
    ACCOUNT_DIALOG_CHANGE
} from '../constants/Account'

const initialState = {
    incomeAccountList: [],
    assetAccountList: [],
    expenseAccountList: [],
    totals: {
        total: 0,
        favorite: 0,
        operational: 0
    },
    ui: {
        hiddenAccountsVisible: false,
        accountListLoading: true,
        accountListError: false
    },
    dialog: {
        open: false,
        full: false,
        account: {attributes: {}},
        valid: false,
        errors: { }
    }
};

function validateAccountForm(account) {
    var attributes = account.attributes;
    var errors = {};
    if (!attributes.name) {
        errors.name = 'Name is empty'
    }

    if (!attributes.account_type) {
        errors.account_type = 'Type is not selected'
    }

    if (!/^-?(0|[1-9]\d*)\.?\d{0,2}?$/.test(attributes.balance)) {
        errors.balance = 'Amount is invalid'
    }

    if (!attributes.currency_id) {
        errors.currency_id = 'Currency is not selected'
    }

    if ((attributes.favorite || attributes.operational) && attributes.account_type != 'asset') {
        errors.account_type = 'Only asset accounts can be favorite or operational'
    }

    return {valid: Object.keys(errors).length == 0, errors: errors}
}

export default function accountViewReducer(state = initialState, action) {
    var ui = state.ui;
    var dialog = state.dialog;
    switch (action.type) {
        case ACCOUNT_DIALOG_OPEN:
            var validInitial = validateAccountForm(action.payload.account);
            dialog = {...dialog, open: true, full: action.payload.full, account: action.payload.account, valid: validInitial.valid, errors: validInitial.errors};
            return {...state, dialog: dialog};
        case ACCOUNT_DIALOG_CLOSE:
            dialog = {...dialog, open: false};
            return {...state, dialog: dialog};
        case ACCOUNT_DIALOG_CHANGE:
            var valid = validateAccountForm(action.payload);
            dialog = {...dialog, account: action.payload, valid: valid.valid, errors: valid.errors};
            return {...state, dialog: dialog};
        case GET_ACCOUNTLIST_REQUEST:
            ui = {...ui, accountListLoading: true, accountListError: false};
            return {...state, ui: ui};
        case GET_ACCOUNTLIST_SUCCESS:
            var incomeList = action.payload.filter((item) => item.attributes.account_type == 'income');
            var assetList = action.payload.filter((item) => item.attributes.account_type == 'asset');
            var expenseList = action.payload.filter((item) => item.attributes.account_type == 'expense');
            ui = {...ui, accountListLoading: false, accountListError: false};
            var totals = {
                total: assetList.reduce((prev, item) => prev + item.attributes.primary_balance, 0),
                favorite: assetList.filter((item) => item.attributes.favorite).reduce((prev, item) => prev + item.attributes.primary_balance, 0),
                operational: assetList.filter((item) => item.attributes.operational).reduce((prev, item) => prev + item.attributes.primary_balance, 0)
            };
            return {
                ...state,
                incomeAccountList: incomeList,
                assetAccountList: assetList,
                expenseAccountList: expenseList,
                totals: totals,
                ui: ui
            };
        case GET_ACCOUNTLIST_FAILURE:
            ui = {...ui, accountListLoading: false, accountListError: true};
            return {
                ...state,
                incomeAccountList: [],
                assetAccountList: [],
                expenseAccountList: [],
                ui: ui,
                totals: {total: 0, favorite: 0, operational: 0}
            };
        case TOGGLE_HIDDEN_ACCOUNTS:
            ui = {...ui, hiddenAccountsVisible: action.payload};
            return {...state, ui: ui};
        default:
            return state;
    }
}
