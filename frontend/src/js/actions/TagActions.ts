import { Action } from 'redux';
import { processApiResponse } from '../util/ApiUtils';

import { TagActionType } from '../constants/Tag';

export interface TagAction extends Action {
    payload: string[];
}

export function loadTagList() {
    return dispatch => {
        dispatch({ type: TagActionType.TagLoad, payload: [] });

        fetch('/api/tags')
            .then(processApiResponse)
            .then(function (json) {
                dispatch({ type: TagActionType.TagStore, payload: json.tags });
            })
            .catch(function () {
                dispatch({ type: TagActionType.TagLoad, payload: [] });
            });
    };
}
