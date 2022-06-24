import React, {Fragment} from 'react';
import Paper from '@mui/material/Paper';

import SettingsEditor from '../../containers/SettingsEditor';
import CurrencyEditor from '../../containers/CurrencyEditor';
import CategoryViewer from '../../containers/CategoryViewer';

export function SettingsPage() {
        return (
            <Fragment>
                <Paper variant='outlined'>
                    <SettingsEditor/>
                </Paper>
                <Paper variant='outlined'>
                    <CurrencyEditor/>
                </Paper>
                <Paper variant='outlined'>
                    <CategoryViewer/>
                </Paper>
            </Fragment>
        )
}

export default SettingsPage;
