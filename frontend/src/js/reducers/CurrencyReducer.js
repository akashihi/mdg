import {GET_CURRENCYLIST_REQUEST, GET_CURRENCYLIST_SUCCESS, GET_CURRENCYLIST_FAILURE} from '../constants/Currency'

const initialState = {
    currencyList: []
};

export default function currencyReducer(state = initialState, action) {
    switch(action.type) {
        case GET_CURRENCYLIST_REQUEST:
            return {...state, currencyList: Array(1000).fill('Currency loading')};
        case GET_CURRENCYLIST_SUCCESS:
            return {...state, currencyList: action.payload};
        case GET_CURRENCYLIST_FAILURE:
            return {...state, currencyList: Array(1000).fill('Error loading currency')};
        default:
            return state;
    }
}
