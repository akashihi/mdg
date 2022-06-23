import React, {Component, Fragment} from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ClipLoader from 'react-spinners/ClipLoader';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import SettingsEditor from '../../containers/SettingsEditor';
import CurrencyEditor from '../../containers/CurrencyEditor';
import CategoryViewer from '../../containers/CategoryViewer.js';

export function SettingsPage() {
        return (
            <Fragment>
                <Paper variant='outlined'>
                    <SettingsEditor/>
                </Paper>
                <Paper variant='outlined'>
                    <CurrencyEditor/>
                </Paper>
            </Fragment>
        )
    /*
<Divider/>
    <Grid item xs={12} sm={12} md={12} lg={12}>
        <CategoryViewer/>
    </Grid>*/
}

export default SettingsPage;
