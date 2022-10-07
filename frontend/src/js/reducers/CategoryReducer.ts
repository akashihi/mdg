import { produce } from 'immer';
import {Category} from '../api/model';
import { CategoryAction } from '../actions/CategoryActions';
import { CategoryActionType } from '../constants/Category';

export interface CategoryState {
    categoryList: Category[];
    available: boolean;
}

const initialState: CategoryState = {
    categoryList: [],
    available: false,
};

export default function categoryReducer(state: CategoryState = initialState, action: CategoryAction) {
    switch (action.type) {
        case CategoryActionType.CategoriesLoad:
            return produce(state, draft => {
                draft.available = false;
            });
        case CategoryActionType.CategoriesStore:
            return produce(state, draft => {
                draft.available = true;
                draft.categoryList = action.payload;
            });
        case CategoryActionType.CategoriesFailure:
            return produce(state, draft => {
                draft.available = false;
            });
        default:
            return state;
    }
}
