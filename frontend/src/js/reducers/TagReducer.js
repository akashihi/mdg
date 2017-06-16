import {GET_TAGLIST_REQUEST, GET_TAGLIST_SUCCESS, GET_TAGLIST_FAILURE} from '../constants/Tag'

const initialState = {
    tagList: []
};

export default function tagReducer(state = initialState, action) {
    switch(action.type) {
        case GET_TAGLIST_REQUEST:
            return {...state, tagList: []};
        case GET_TAGLIST_SUCCESS:
            return {...state, tagList: action.payload};
        case GET_TAGLIST_FAILURE:
            return {...state, tagList: []};
        default:
            return state;
    }
}
