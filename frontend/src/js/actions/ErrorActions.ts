import {NotifyError} from "../reducers/ErrorReducer";
import * as Model from '../api/model';

export function reportError(e: Model.Problem) {
    return NotifyError(e);
}
