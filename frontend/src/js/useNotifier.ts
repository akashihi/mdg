import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {RootState} from "./reducers/rootReducer";

export const useNotifier = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.error.errors || []);
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        notifications.forEach(n => {
            enqueueSnackbar(n, { autoHideDuration: 5000 });
        })
    }, [notifications, dispatch]);
}
