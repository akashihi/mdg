import {OrderedMap, Map} from 'immutable';
import {
    GET_CATEGORYLIST_REQUEST,
    GET_CATEGORYLIST_SUCCESS,
    GET_CATEGORYLIST_FAILURE,
    CATEGORY_DIALOG_OPEN,
    CATEGORY_DIALOG_CLOSE
} from '../constants/Category'

const initialState = Map({
    categoryList: OrderedMap(),
    ui: Map({
        categoryListLoading: true,
        categoryListError: false
    }),
    dialog: Map({
        open: false,
        full: false,
        category: Map(),
        id: null
    })
});

export default function categoryReducer(state = initialState, action) {
    switch (action.type) {
        case CATEGORY_DIALOG_OPEN:
            return state.setIn(['dialog', 'open'], true)
              .setIn(['dialog', 'full'], action.payload.full)
              .setIn(['dialog', 'category'], action.payload.category)
              .setIn(['dialog', 'id'], action.payload.id);
        case CATEGORY_DIALOG_CLOSE:
            return state.setIn(['dialog', 'open'], false);
        case GET_CATEGORYLIST_REQUEST:
            return state.setIn(['ui', 'categoryListLoading'], true)
                .setIn(['ui', 'categoryListError'], false);
        case GET_CATEGORYLIST_SUCCESS:
            return state.setIn(['ui', 'categoryListLoading'], false)
                .setIn(['ui', 'categoryListError'], false)
                .set('categoryList', action.payload);
        case GET_CATEGORYLIST_FAILURE:
            return state.setIn(['ui', 'categoryListLoading'], false)
                .setIn(['ui', 'categoryListError'], true)
                .set('categoryList', OrderedMap());
        default:
            return state;
    }
}
