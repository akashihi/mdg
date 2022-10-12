import { wrap } from './base';
import * as API from '../api/api';
import { TagStore } from '../reducers/TagReducer';
import { NotifyError } from '../reducers/ErrorReducer';

export function loadTagList() {
    return wrap(async dispatch => {
        const result = await API.listTags();
        if (result.ok) {
            dispatch(TagStore(result.val));
        } else {
            dispatch(NotifyError(result.val));
        }
    });
}
