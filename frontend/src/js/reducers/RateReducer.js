import {GET_RATELIST_REQUEST, GET_RATELIST_SUCCESS, GET_RATELIST_FAILURE} from '../constants/Rate'

const initialState = {
    rateList: []
};

export default function currencyReducer(state = initialState, action) {
    switch(action.type) {
        case GET_RATELIST_REQUEST:
        case GET_RATELIST_FAILURE:
            return {...state, rateList: []};
        case GET_RATELIST_SUCCESS:
            return {...state, rateList: action.payload};
        default:
            return state;
    }
}
