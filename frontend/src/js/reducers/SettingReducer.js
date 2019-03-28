import {Map} from 'immutable';
import {GET_SETTING_REQUEST, GET_SETTING_SUCCESS, GET_SETTING_FAILURE} from '../constants/Setting'

const initialState = Map({
    primaryCurrency: -1,
    closeTransactionDialog: true,
    ui: Map({
        settingListLoading: true,
        settingListError: false
    })
});

export default function currencyReducer(state = initialState, action) {
    switch(action.type) {
        case GET_SETTING_REQUEST:
            return state.setIn(['ui', 'settingListLoading'], true)
                .setIn(['ui', 'settingListError'], false);
        case GET_SETTING_SUCCESS:
            return state.set('primaryCurrency', parseInt(action.payload.get('currency.primary').get('value')))
                .set('closeTransactionDialog', action.payload.get('ui.transaction.closedialog').get('value') == 'true')
                .setIn(['ui', 'settingListLoading'], false)
                .setIn(['ui', 'settingListError'], false);
        case GET_SETTING_FAILURE:
            return state.setIn(['ui', 'settingListLoading'], false)
                .setIn(['ui', 'settingListError'], true);
        default:
            return state;
    }
}
