import {
  GET_TOTALSREPORT_REQUEST,
  GET_TOTALSREPORT_SUCCESS,
  GET_TOTALSREPORT_FAILURE,
  GET_SIMPLEASSETREPORT_REQUEST,
  GET_SIMPLEASSETREPORT_SUCCESS,
  GET_SIMPLEASSETREPORT_FAILURE
} from '../constants/Report'

const initialState = {
   totalsReport: [],
   simpleAssetReport: []
};

export default function reportReducer(state = initialState, action) {
    switch(action.type) {
        case GET_TOTALSREPORT_REQUEST:
            return {...state, totalsReport: []};
        case GET_TOTALSREPORT_SUCCESS:
            return {...state, totalsReport: action.payload};
        case GET_TOTALSREPORT_FAILURE:
            return {...state, totalsReport: []};
        case GET_SIMPLEASSETREPORT_REQUEST:
        case GET_SIMPLEASSETREPORT_FAILURE:
            return {...state, simpleAssetReport: []}
        case GET_SIMPLEASSETREPORT_SUCCESS:
          return {...state, simpleAssetReport: action.payload}
        default:
            return state;
    }
}
