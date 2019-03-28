import { OrderedMap } from 'immutable';
import {GET_CURRENCYLIST_REQUEST, GET_CURRENCYLIST_SUCCESS, GET_CURRENCYLIST_FAILURE} from '../constants/Currency'

const initialState = {
    currencies: OrderedMap(),
    loading: false,
    error: false
};

export default function currencyReducer(state = initialState, action) {
    switch(action.type) {
        case GET_CURRENCYLIST_REQUEST:
            return {...state, loading: true, error: false, currencies: OrderedMap()};
        case GET_CURRENCYLIST_SUCCESS:
            return {...state, loading: false, errot:false, currencies: action.payload};
        case GET_CURRENCYLIST_FAILURE:
            return {...state, loading: false, error: true, currencies: OrderedMap()};
        default:
            return state;
    }
}
