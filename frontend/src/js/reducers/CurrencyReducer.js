import {OrderedMap, Map} from 'immutable';
import {GET_CURRENCYLIST_REQUEST, GET_CURRENCYLIST_SUCCESS, GET_CURRENCYLIST_FAILURE} from '../constants/Currency'

const initialState = Map({
    currencies: OrderedMap(),
    loading: false,
    error: false
});

export default function currencyReducer(state = initialState, action) {
    switch (action.type) {
        case GET_CURRENCYLIST_REQUEST:
            return state.set('loading', true).set('error', false).set('currencies', OrderedMap());
        case GET_CURRENCYLIST_SUCCESS:
            return state.set('loading', false).set('error', false).set('currencies', action.payload);
        case GET_CURRENCYLIST_FAILURE:
            return state.set('loading', false).set('error', true).set('currencies', action.payload);
        default:
            return state;
    }
}
