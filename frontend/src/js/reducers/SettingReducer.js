import {GET_SETTING_REQUEST, GET_SETTING_SUCCESS, GET_SETTING_FAILURE} from '../constants/Setting'

const initialState = {
    primaryCurrency: '',
    closeTransactionDialog: true
};

export default function currencyReducer(state = initialState, action) {
    switch(action.type) {
        case GET_SETTING_REQUEST:
            return {...state, primaryCurrency: {id: -1, attributes: {value: 'Loading'}}};
        case GET_SETTING_SUCCESS:
            var primaryCurrencyObject = action.payload.filter((item) => item.id == 'currency.primary')[0]
            var primaryCurrency = Number(primaryCurrencyObject.attributes.value)

            var closeTransactionDialogObject = action.payload.filter((item) => item.id == 'ui.transaction.closedialog')[0]
            var closeTransactionDialog = Number(closeTransactionDialogObject.attributes.value)

            return {...state, primaryCurrency: primaryCurrency, closeTransactionDialog: closeTransactionDialog};
        case GET_SETTING_FAILURE:
            return {...state, primaryCurrency: {id: -1, attributes: {value: 'Failed to load'}}};
        default:
            return state;
    }
}
