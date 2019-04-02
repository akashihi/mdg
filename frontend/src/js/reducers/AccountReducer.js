import {OrderedMap, Map} from 'immutable';
import {
    GET_ACCOUNTLIST_REQUEST,
    GET_ACCOUNTLIST_FAILURE,
    GET_ACCOUNTLIST_SUCCESS,
    TOGGLE_HIDDEN_ACCOUNTS,
    ACCOUNT_DIALOG_OPEN,
    ACCOUNT_DIALOG_CLOSE,
    ACCOUNT_DIALOG_CHANGE
} from '../constants/Account'

const initialState = Map({
    incomeAccountList: OrderedMap(),
    assetAccountList: OrderedMap(),
    expenseAccountList: OrderedMap(),
    accountList: OrderedMap(),
    totals: Map({
        total: 0,
        favorite: 0,
        operational: 0
    }),
    ui: Map({
        hiddenAccountsVisible: false,
        accountListLoading: true,
        accountListError: false
    }),
    dialog: Map({
        open: false,
        full: false,
        account: Map(),
        valid: false,
        errors: Map()
    })
});

function validateAccountForm(account) {
    var errors = Map();
    if (!account.get('name')) {
        errors.set('name', 'Name is empty')
    }

    if (!account.get('account_type')) {
        errors.set('account_type', 'Type is not selected')
    }

    if (!account.get('currency_id')) {
        errors.set('currency_id', 'Currency is not selected')
    }

    if ((account.get('favorite') || account.get('operational')) && account.get('account_type') != 'asset') {
        errors.set('account_type', 'Only asset accounts can be favorite or operational')
    }

    return Map({valid: errors.isEmpty(), errors: errors})
}

export default function accountViewReducer(state = initialState, action) {
    switch (action.type) {
        case ACCOUNT_DIALOG_OPEN:
            var validInitial = validateAccountForm(action.payload.account);
            return state.setIn(['dialog', 'open'], true)
              .setIn(['dialog', 'full'], action.payload.full)
              .setIn(['dialog', 'account'], action.payload.account)
              .setIn(['dialog', 'valid'], validInitial.get('valid'))
              .setIn(['dialog', 'errors'], validInitial.get('errors'))
        case ACCOUNT_DIALOG_CLOSE:
            return state.setIn(['dialog', 'open'], false)
        case ACCOUNT_DIALOG_CHANGE:
          var valid = validateAccountForm(action.payload);
          return state.setIn(['dialog', 'account'], action.payload)
            .setIn(['dialog', 'valid'], valid.get('valid'))
            .setIn(['dialog', 'errors'], valid.get('errors'))
        case GET_ACCOUNTLIST_REQUEST:
            return state.setIn(['ui', 'accountListLoading'], true)
              .setIn(['ui', 'accountListError'], false);
        case GET_ACCOUNTLIST_SUCCESS:
          var assetAccountList = action.payload.filter((item) => item.get('account_type') == 'asset')
            var totals = Map({
                total: assetAccountList.reduce((prev, item) => prev + item.get('primary_balance')*100, 0)/100,
                favorite: assetAccountList.filter((item) => item.get('favorite')).reduce((prev, item) => prev + item.get('primary_balance')*100, 0)/100,
                operational: assetAccountList.filter((item) => item.get('operational')).reduce((prev, item) => prev + item.get('primary_balance')*100, 0)/100
            });
            return state.set('accountList', action.payload)
              .set('incomeAccountList', action.payload.filter((item) => item.get('account_type') == 'income'))
              .set('assetAccountList', assetAccountList)
              .set('expenseAccountList', action.payload.filter((item) => item.get('account_type') == 'expense'))
              .set('totals', totals)
              .setIn(['ui', 'accountListLoading'], false)
              .setIn(['ui', 'accountListError'], false);
        case GET_ACCOUNTLIST_FAILURE:
          return state.set('accountList', OrderedMap())
            .set('incomeAccountList', OrderedMap())
            .set('assetAccountList', OrderedMap())
            .set('expenseAccountList', OrderedMap())
            .set('totals', Map({total: 0, favorite: 0, operational: 0}))
            .setIn(['ui', 'accountListLoading'], false)
            .setIn(['ui', 'accountListError'], true);
        case TOGGLE_HIDDEN_ACCOUNTS:
            return state.setIn(['ui', 'hiddenAccountsVisible'], action.payload)
        default:
            return state;
    }
}
