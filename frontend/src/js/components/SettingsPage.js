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

import CategoryViewer from '../containers/CategoryViewer.js';

class CurrencyEditor extends Component {
    onCurrencyChange(k, item) {
        const modified = item.set('active', !item.get('active'));
        this.props.currencyActions.updateCurrency(k, modified)
    }

    render() {
        const cls = this;
        const props = this.props;

        if (props.currency.get('loading')) {
            return <ClipLoader sizeUnit={'px'} size={180} loading={true}/>
        }

        if (props.currency.get('error')) {
            return <h1>Error loading currency list</h1>
        }

        const allCurrencies = props.currency.get('currencies').map((v, k) => {
            return (
                <ListItem key={k} dense button>
                    <ListItemText primary={v.get('name')}/>
                    <ListItemSecondaryAction><Checkbox checked={v.get('active')}
                                                       onChange={() => cls.onCurrencyChange(k, v)}/></ListItemSecondaryAction>
                </ListItem>
            )
        }).valueSeq().toJS();

        return (<List sx={{
            position: 'relative',
            overflow: 'auto',
            maxHeight: 160,
            margin: '1em'
        }}>
            {allCurrencies}
        </List>)
    }
}

class SettingEditor extends Component {
    onPrimaryCurrencyChange(value) {
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
    }

    render() {
        const props = this.props;

        if (props.ui.get('settingListLoading')) {
            return <ClipLoader sizeUnit={'px'} size={150} loading={true}/>
        }
        if (props.ui.get('settingListError')) {
            return <h1>Unable to load settings</h1>
        }

        const currencies = props.currency.get('currencies').filter((v) => v.get('active')).map((v, k) => {
            return (
                <MenuItem value={k} key={k}>{v.get('name')}</MenuItem>
            )
        }).valueSeq().toJS();

        return (<Fragment>
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
        </Fragment>)
    }
}

export default class SettingsPage extends Component {
    render() {
        const props = this.props;

        return (
            <Grid  container spacing={2}>
                <SettingEditor ui={props.setting.get('ui')} currency={props.currency}
                               primaryCurrency={props.primaryCurrency}
                               closeTransactionDialog={props.closeTransactionDialog}
                               language={props.language}
                               actions={props.actions}/>
                <Divider/>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <p>Active currencies:</p>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <CurrencyEditor currency={props.currency} currencyActions={this.props.currencyActions}/>
                    </Grid>
                <Divider/>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <CategoryViewer/>
                    </Grid>
            </Grid>
        )
    }
}
