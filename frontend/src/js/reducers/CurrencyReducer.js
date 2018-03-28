import {GET_CURRENCYLIST_REQUEST, GET_CURRENCYLIST_SUCCESS, GET_CURRENCYLIST_FAILURE} from '../constants/Currency'

const initialState = {
    currencyList: []
};

export default function currencyReducer(state = initialState, action) {
    var index = 0;
    switch(action.type) {
        case GET_CURRENCYLIST_REQUEST:
            return {...state, currencyList: Array(1000).fill({id: index++, attributes: {name: 'Loading currencies'}})};
        case GET_CURRENCYLIST_SUCCESS:
            return {...state, currencyList: action.payload};
        case GET_CURRENCYLIST_FAILURE:
            return {...state, currencyList: Array(1000).fill({id: index++, attributes: {name: 'Error loading currencies'}})};
        default:
            return state;
    }
}
