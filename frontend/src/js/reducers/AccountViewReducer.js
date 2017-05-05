
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
    switch(action.type) {
        default:
            return state;
    }
}
