import { Action } from 'redux';

import { TagActionType } from '../constants/Tag';
import {wrap} from "./base";
import * as API from '../api/api';

export interface TagAction extends Action {
    payload: string[];
}

export function loadTagList() {
    return wrap(async dispatch => {
        dispatch({ type: TagActionType.TagLoad, payload: [] });
        const result = await API.listTags();
        if (result.ok) {
            dispatch({ type: TagActionType.TagStore, payload: result.val });
        } else {
            dispatch({ type: TagActionType.TagLoad, payload: [] });
        }
    });
}
