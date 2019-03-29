import {OrderedMap, Map} from 'immutable';
import {
    GET_CATEGORYLIST_REQUEST,
    GET_CATEGORYLIST_SUCCESS,
    GET_CATEGORYLIST_FAILURE,
    CATEGORY_DIALOG_OPEN,
    CATEGORY_DIALOG_CLOSE,
    CATEGORY_DIALOG_CHANGE
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
        id: null,
        valid: false,
        errors: Map()
    })
});

function validateCategoryForm(category) {
    var errors = Map();
    if (!category.get('name')) {
        errors = errors.set('name', 'Name is empty')
    }

    if (!category.get('account_type')) {
        errors = errors.set('account_type', 'Type is not selected')
    }

    if (isNaN(category.get('priority'))) {
        errors = errors.set('order', 'Order is invalid')
    }

    return Map({valid: errors.isEmpty(), errors: errors})
}


export default function categoryReducer(state = initialState, action) {
    switch (action.type) {
        case CATEGORY_DIALOG_OPEN:
            var validInitial = validateCategoryForm(action.payload.category);

            return state.setIn(['dialog', 'open'], true)
              .setIn(['dialog', 'full'], action.payload.full)
              .setIn(['dialog', 'category'], action.payload.category)
              .setIn(['dialog', 'id'], action.payload.id)
              .setIn(['dialog', 'valid'], validInitial.get('valid'))
              .setIn(['dialog', 'errors'], validInitial.get('errors'))
        case CATEGORY_DIALOG_CLOSE:
            return state.setIn(['dialog', 'open'], false)
        case CATEGORY_DIALOG_CHANGE:
            var valid = validateCategoryForm(action.payload);
            return state.setIn(['dialog', 'open'], true)
              .setIn(['dialog', 'category'], action.payload)
              .setIn(['dialog', 'valid'], valid.get('valid'))
              .setIn(['dialog', 'errors'], valid.get('errors'))
        case GET_CATEGORYLIST_REQUEST:
            return state.setIn(['ui', 'categoryListLoading'], true)
                .setIn(['ui', 'categoryListError'], false)
        case GET_CATEGORYLIST_SUCCESS:
            return state.setIn(['ui', 'categoryListLoading'], false)
                .setIn(['ui', 'categoryListError'], false)
                .set('categoryList', action.payload)
        case GET_CATEGORYLIST_FAILURE:
            return state.setIn(['ui', 'categoryListLoading'], false)
                .setIn(['ui', 'categoryListError'], true)
                .set('categoryList', OrderedMap())
        default:
            return state;
    }
}
