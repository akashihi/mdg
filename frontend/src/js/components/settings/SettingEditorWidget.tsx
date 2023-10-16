import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { SettingsEditorProps } from '../../containers/SettingsEditor';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ReindexUiState } from '../../reducers/SettingReducer';
import {setOverviewWidget} from "../../actions/SettingActions";

export function SettingEditorWidget(props: SettingsEditorProps) {
    const currencies = props.activeCurrencies.map(v => {
        return (
            <MenuItem value={v.id} key={v.id}>
                {v.name}
            </MenuItem>
        );
    });

    const overviewWidgets = [
            <MenuItem value="accounts" key="accounts">
                Accounts Overview
            </MenuItem>,
            <MenuItem value="finance" key="finance">
                Financial state
            </MenuItem>,
            <MenuItem value="asset" key="asset">
                Asset overview
            </MenuItem>,
            <MenuItem value="budget" key="budget">
                Budget state
            </MenuItem>,
            <MenuItem value="transactions" key="transactions">
                Latest transactions
            </MenuItem>]

    return (
        <Fragment>
            <Backdrop open={!props.setting.available}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Backdrop open={props.setting.indexingUi === ReindexUiState.InProgress}>
                <CircularProgress color="inherit" />
                <Typography color="info" paragraph={true} variant="inherit">
                    Indexing transactions content may take a while
                </Typography>
            </Backdrop>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <p>Primary currency:</p>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <Select
                        value={props.setting.primaryCurrency}
                        onChange={event => props.setPrimaryCurrency(event.target.value as number)}>
                        {currencies}
                    </Select>
                </Grid>
                <Box width="100%" />
                <Grid item xs={6} sm={6} md={6} lg={4}>
                    <p>Automatically close transaction dialog:</p>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={4}>
                    <Checkbox
                        checked={props.setting.closeTransactionDialog}
                        onChange={(event, value) => props.setCloseTransactionDialog(value)}
                    />
                </Grid>
                <Box width="100%" />
                <Grid item xs={6} sm={6} md={6} lg={4}>
                    <p>Reindex transactions search data:</p>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={4}>
                    <Button variant="contained" color="primary" onClick={props.reindexTransactions}>
                        Start reindex
                    </Button>
                    {props.setting.indexingUi === ReindexUiState.Failed && (
                        <Typography color="error" paragraph={true} variant="inherit">
                            Reaindexing failed. Check logs and try one more time
                        </Typography>
                    )}
                </Grid>
                <Box width="100%" />
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <p>Language:</p>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <Select value={props.setting.language} onChange={event => props.setLanguage(event.target.value)}>
                        <MenuItem value="cz" key="cz">
                            Čeština
                        </MenuItem>
                        <MenuItem value="de" key="de">
                            Deutsch
                        </MenuItem>
                        <MenuItem value="en-US" key="en-US">
                            English
                        </MenuItem>
                        <MenuItem value="lt" key="lt">
                            lietùvių kalbà
                        </MenuItem>
                        <MenuItem value="ru" key="ru">
                            Русский
                        </MenuItem>
                    </Select>
                </Grid>
                <Box width="100%" />
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <p>Overview Page content:</p>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={4}>
                    <Select value={props.setting.overview.lt} sx={{ minWidth: 200 }} onChange={event => props.setOverviewWidget("lt", event.target.value)}>
                        {overviewWidgets}
                    </Select>
                    <Select value={props.setting.overview.rt} sx={{ minWidth: 200 }} onChange={event => props.setOverviewWidget("rt", event.target.value)}>
                        {overviewWidgets}
                    </Select>
                    <br/>
                    <Select value={props.setting.overview.lb} sx={{ minWidth: 200 }} onChange={event => props.setOverviewWidget("lb", event.target.value)}>
                        {overviewWidgets}
                    </Select>
                    <Select value={props.setting.overview.rb} sx={{ minWidth: 200 }} onChange={event => props.setOverviewWidget("rb", event.target.value)}>
                        {overviewWidgets}
                    </Select>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default SettingEditorWidget;
