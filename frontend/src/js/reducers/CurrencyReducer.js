import { OrderedMap } from 'immutable';
import {GET_CURRENCYLIST_REQUEST, GET_CURRENCYLIST_SUCCESS, GET_CURRENCYLIST_FAILURE} from '../constants/Currency'

const initialState = {
    currencies: OrderedMap()
};

export default function currencyReducer(state = initialState, action) {
    switch(action.type) {
        case GET_CURRENCYLIST_REQUEST:
            return {...state, currencies: OrderedMap()};
        case GET_CURRENCYLIST_SUCCESS:
            return {...state, currencies: action.payload};
        case GET_CURRENCYLIST_FAILURE:
            return {...state, currencies: OrderedMap()};
        default:
            return state;
    }
}
