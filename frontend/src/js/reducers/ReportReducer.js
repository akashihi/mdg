import {GET_TOTALSREPORT_REQUEST, GET_TOTALSREPORT_SUCCESS, GET_TOTALSREPORT_FAILURE} from '../constants/Report'

const initialState = {
    totalsReport: []
};

export default function reportReducer(state = initialState, action) {
    switch(action.type) {
        case GET_TOTALSREPORT_REQUEST:
            return {...state, totalsReport: []};
        case GET_TOTALSREPORT_SUCCESS:
            return {...state, totalsReport: action.payload};
        case GET_TOTALSREPORT_FAILURE:
            return {...state, totalsReport: []};
        default:
            return state;
    }
}
