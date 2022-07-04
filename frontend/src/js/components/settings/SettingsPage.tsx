import React, {useState, Fragment} from 'react';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import SettingsEditor from '../../containers/SettingsEditor';
import CurrencyEditor from '../../containers/CurrencyEditor';
import CategoryViewer from '../../containers/CategoryViewer';

export function SettingsPage() {
    const [tabValue, setTabValue] = useState('settings');

    const switchTab = (ev, value) => {
        setTabValue(value);
    }
    return (
        <Fragment>
            <Tabs value={tabValue} onChange={switchTab} centered scrollButtons='auto'>
                <Tab label='Settings' value='settings'/>
                <Tab label='Currencies' value='currencies'/>
                <Tab label='Categories' value='categories'/>
            </Tabs>
            {tabValue == 'settings' &&
            <Paper variant='outlined'><SettingsEditor/></Paper>}
            {tabValue == 'currencies' &&
            <Paper variant='outlined'><CurrencyEditor/></Paper>}
            {tabValue == 'categories' &&
            <Paper variant='outlined'><CategoryViewer/></Paper>}
        </Fragment>
    )
}

export default SettingsPage;
