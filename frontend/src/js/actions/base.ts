import {RootState} from "../reducers/rootReducer";

export function wrap(fn) {
    return function(dispatch, getState: () => RootState) {
        fn(dispatch, getState).catch(error => {
            dispatch({ type: 'UNCAUGHT_ERROR', error })
        });
    };
}
