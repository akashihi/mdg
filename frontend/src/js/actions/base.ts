export function wrap(fn) {
    return function(dispatch) {
        fn(dispatch).catch(error => {
            console.log(error);
            dispatch({ type: 'UNCAUGHT_ERROR', error })
        });
    };
}
