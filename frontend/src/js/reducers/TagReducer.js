import {OrderedMap, Map} from 'immutable';

import {GET_TAGLIST_REQUEST, GET_TAGLIST_SUCCESS, GET_TAGLIST_FAILURE} from '../constants/Tag'

const initialState = Map({
    tagList: OrderedMap()
});

export default function tagReducer(state = initialState, action) {
    switch(action.type) {
        case GET_TAGLIST_REQUEST:
        case GET_TAGLIST_FAILURE:
            return state.set('tagList', OrderedMap());
        case GET_TAGLIST_SUCCESS:
            return state.set('tagList', action.payload);
        default:
            return state;
    }
}
