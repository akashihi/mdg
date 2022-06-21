import React, {Component, Fragment} from 'react';
import Grid from '@mui/material/Grid';
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
import {SettingState} from "../../reducers/SettingReducer";

export function SettingEditorWidget(props) {
    /*onPrimaryCurrencyChange(value) {
        this.props.actions.setPrimaryCurrency(value);
    }

    onCloseTransactionDialogChange(value) {
        this.props.actions.setCloseTransactionDialog(value);
    }

    onLanguageChange(value) {
        this.props.actions.setLanguage(value);
    }

    onReindexClick() {
        this.props.actions.reindexTransactions();
    }*/
    /*    if (props.ui.settingListLoading) {
            return <ClipLoader sizeUnit={'px'} size={150} loading={true}/>
        }
        if (props.ui.settingListError) {
            return <h1>Unable to load settings</h1>
        }

        */
    const currencies = props.activeCurrencies.map((v) => {
        return (
            <MenuItem value={v.id} key={v.id}>{v.name}</MenuItem>
        )
    });
    /*return (
        <Fragment>
        <Grid item xs={12} sm={6} md={6} lg={4}>
            <p>Primary currency:</p>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
            <Select
                value={props.primaryCurrency}
                onChange={(ev) => ::this.onPrimaryCurrencyChange(ev.target.value)}
            >
                {currencies}
            </Select>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
            <p>By default close transaction dialog:</p>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
            <Checkbox checked={this.props.closeTransactionDialog}
                      onChange={(ev, value) => ::this.onCloseTransactionDialogChange(value)}/>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
            <p>Reindex transactions search data:</p>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
            <Button color='primary' onClick={::this.onReindexClick}>Start reindex</Button>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
            <p>Language:</p>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
            <Select
                value={props.language}
                onChange={(ev) => ::this.onLanguageChange(ev.target.value)}
            >
                <MenuItem value='cz' key='cz'>cz</MenuItem>
                <MenuItem value='de' key='de'>de</MenuItem>
                <MenuItem value='en-US' key='en-US'>en-US</MenuItem>
                <MenuItem value='lt' key='lt'>lt</MenuItem>
                <MenuItem value='ru' key='ru'>ru</MenuItem>
            </Select>
        </Grid>
    </Fragment>
    )*/
    console.log(props)
    return (<Fragment>
        <Grid item xs={12} sm={6} md={6} lg={4}>
            <p>Primary currency:</p>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
            <Select value={props.setting.primaryCurrency}>
                {currencies}
            </Select>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
            <p>Automatically close transaction dialog:</p>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
            <Checkbox checked={props.setting.closeTransactionDialog}/>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
            <p>Reindex transactions search data:</p>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={4}>
            <Button color='primary'>Start reindex</Button>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
            <p>Language:</p>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={4}>
            <Select value={props.setting.language}>
                <MenuItem value='cz' key='cz'>Čeština</MenuItem>
                <MenuItem value='de' key='de'>Deutsch</MenuItem>
                <MenuItem value='en-US' key='en-US'>English</MenuItem>
                <MenuItem value='lt' key='lt'>lietùvių kalbà</MenuItem>
                <MenuItem value='ru' key='ru'>Русский</MenuItem>
            </Select>
        </Grid>
    </Fragment>)
}

export default SettingEditorWidget;
