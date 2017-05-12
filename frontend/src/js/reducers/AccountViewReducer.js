import { GET_ACCOUNTLIST_REQUEST, GET_ACCOUNTLIST_FAILURE, GET_ACCOUNTLIST_SUCCESS, TOGGLE_HIDDEN_ACCOUNTS} from '../constants/Account'

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
};

export default function accountViewReducer(state = initialState, action) {
    var ui = state.ui;
    switch(action.type) {
        case GET_ACCOUNTLIST_REQUEST:
            ui = {...ui, accountListLoading: true, accountListError: false};
            return {...state, ui: ui};
        case GET_ACCOUNTLIST_SUCCESS:
            var incomeList = action.payload.filter((item) => item.attributes.account_type == 'income');
            var assetList = action.payload.filter((item) => item.attributes.account_type == 'asset');
            var expenseList = action.payload.filter((item) => item.attributes.account_type == 'expense');
            ui = {...ui, accountListLoading: false, accountListError: false};
            var totals = {
                total: assetList.reduce((prev, item) => prev + item.attributes.balance, 0),
                favorite: assetList.filter((item) => item.attributes.favorite).reduce((prev, item) => prev + item.attributes.balance, 0),
                operational: assetList.filter((item) => item.attributes.operational).reduce((prev, item) => prev + item.attributes.balance, 0)
            };
            return {...state, incomeAccountList: incomeList, assetAccountList: assetList, expenseAccountList: expenseList, totals: totals, ui: ui};
        case GET_ACCOUNTLIST_FAILURE:
            ui = {...ui, accountListLoading: false, accountListError: true};
            return {...state, incomeAccountList: [], assetAccountList: [], expenseAccountList:[], ui: ui, totals: { total: 0, favorite: 0, operational: 0}};
        case TOGGLE_HIDDEN_ACCOUNTS:
            ui = {...ui, hiddenAccountsVisible: action.payload};
            return {...state, ui: ui};
        default:
            return state;
    }
}
