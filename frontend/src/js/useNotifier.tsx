import React, {Fragment} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {RootState} from "./reducers/rootReducer";

export const useNotifier = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state: RootState) => state.error.error || undefined);
    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        if (notifications !== undefined) {
            let message = (<Fragment><h3>{notifications.code} ({notifications.status})</h3>: {notifications.title}</Fragment>);
            if (notifications.detail) {
                message = (<Fragment><h3>{notifications.title} ({notifications.code})</h3>: {notifications.detail}</Fragment>);
            }

            enqueueSnackbar(message, { autoHideDuration: 5000 });
        }
    }, [notifications, dispatch]);
}
