import {Action} from 'redux';
import {checkApiError, parseJSON} from '../util/ApiUtils';

import {TagActionType} from '../constants/Tag';

export interface TagAction extends Action {
    payload: string[]
}

export function loadTagList() {
    return (dispatch) => {
        dispatch({type: TagActionType.TagLoad, payload: []})

        fetch('/api/tags')
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json: any) {
                dispatch({type: TagActionType.TagStore, payload: json.tags})
            })
            .catch(function () {
                dispatch({type: TagActionType.TagLoad, payload: []})
            })
    }
}
