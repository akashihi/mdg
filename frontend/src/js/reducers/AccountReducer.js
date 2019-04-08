import {OrderedMap, Map} from 'immutable';
import {
    GET_ACCOUNTLIST_REQUEST,
    GET_ACCOUNTLIST_FAILURE,
    GET_ACCOUNTLIST_SUCCESS,
    TOGGLE_HIDDEN_ACCOUNTS,
    ACCOUNT_DIALOG_OPEN,
    ACCOUNT_DIALOG_CLOSE,
    ACCOUNT_PARTIAL_UPDATE,
    ACCOUNT_PARTIAL_SUCCESS
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
        id: -1
    })
});

function splitAccountList(state) {
  const accountList = state.get('accountList')
  return state.set('incomeAccountList', accountList.filter((item) => item.get('account_type') == 'income'))
    .set('assetAccountList', accountList.filter((item) => item.get('account_type') == 'asset'))
    .set('expenseAccountList', accountList.filter((item) => item.get('account_type') == 'expense'))
}

export default function accountViewReducer(state = initialState, action) {
    var newAccountState;
    switch (action.type) {
        case ACCOUNT_DIALOG_OPEN:
            return state.setIn(['dialog', 'open'], true)
              .setIn(['dialog', 'full'], action.payload.full)
              .setIn(['dialog', 'id'], action.payload.id)
              .setIn(['dialog', 'account'], action.payload.account)
        case ACCOUNT_DIALOG_CLOSE:
            return state.setIn(['dialog', 'open'], false)
        case ACCOUNT_PARTIAL_UPDATE:
        case ACCOUNT_PARTIAL_SUCCESS:
           newAccountState = state.setIn(['accountList', action.payload.id], action.payload.account)
              .setIn(['ui', 'accountListLoading'], false)
           return splitAccountList(newAccountState)
        case GET_ACCOUNTLIST_REQUEST:
            return state.setIn(['ui', 'accountListLoading'], true)
              .setIn(['ui', 'accountListError'], false);
        case GET_ACCOUNTLIST_SUCCESS:
          newAccountState = state.set('accountList', action.payload)
          newAccountState = splitAccountList(newAccountState)
          var assetAccountList = newAccountState.get('assetAccountList')
            var totals = Map({
                total: assetAccountList.reduce((prev, item) => prev + item.get('primary_balance')*100, 0)/100,
                favorite: assetAccountList.filter((item) => item.get('favorite')).reduce((prev, item) => prev + item.get('primary_balance')*100, 0)/100,
                operational: assetAccountList.filter((item) => item.get('operational')).reduce((prev, item) => prev + item.get('primary_balance')*100, 0)/100
            });
            return newAccountState.set('totals', totals)
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
