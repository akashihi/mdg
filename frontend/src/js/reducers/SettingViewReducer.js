import {GET_SETTING_REQUEST, GET_SETTING_SUCCESS, GET_SETTING_FAILURE} from '../constants/Setting'

const initialState = {
  ui: {
      settingListLoading: true,
      settingListError: false
  }
};

export default function currencyReducer(state = initialState, action) {
    var ui = state.ui;
    switch(action.type) {
        case GET_SETTING_REQUEST:
            ui = {...ui, settingListLoading: true, settingListError: false};
            return {...state, ui: ui};
        case GET_SETTING_SUCCESS:
            ui = {...ui, settingListLoading: false, settingListError: false};
            return {...state, ui: ui};
        case GET_SETTING_FAILURE:
            ui = {...ui, settingListLoading: false, settingListError: true};
            return {...state, ui: ui};
        default:
            return state;
    }
}
