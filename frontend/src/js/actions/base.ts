import {GetStateFunc} from "../reducers/rootReducer";

export function wrap(fn) {
    return function(dispatch, getState: GetStateFunc) {
        fn(dispatch, getState).catch(error => {
            dispatch({ type: 'UNCAUGHT_ERROR', error })
        });
    };
}
