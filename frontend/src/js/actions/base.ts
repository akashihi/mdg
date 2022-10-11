import { GetStateFunc } from '../reducers/rootReducer';
import {NotifyError} from "../reducers/ErrorReducer";

export function wrap(fn) {
    return function (dispatch, getState: GetStateFunc) {
        fn(dispatch, getState).catch(error => {
            dispatch(NotifyError({status: -1, code: "UNCAUGHT_ERROR", title: error}))
        });
    };
}
