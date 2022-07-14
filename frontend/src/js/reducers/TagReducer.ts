import produce from "immer";
import { TagActionType } from '../constants/Tag';
import {TagAction} from "../actions/TagActions";
import {SettingUiState} from "../constants/Setting";

export interface TagState {
    tags: string[]
}

const initialState:TagState = {
  tags: []
}

export default function tagReducer (state:TagState = initialState, action: TagAction) {
  switch (action.type) {
    case TagActionType.TagLoad:
    case TagActionType.TagStore:
        return produce(state, draft => { draft.tags = action.payload});
    default:
      return state
  }
}
