import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ClipLoader from 'react-spinners/ClipLoader';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import CategoryViewer from '../containers/CategoryViewer.js';

const styles = {
    root: {
        position: 'relative',
        overflow: 'auto',
        maxHeight: 160,
        margin: '1em'
    }
};

class CurrencyEditorWidget extends Component {
    onCurrencyChange(k, item) {
        const modified = item.set('active', !item.get('active'));
        this.props.currencyActions.updateCurrency(k, modified)
    }

    render() {
        const cls = this;
        const props = this.props;
        const {classes} = props;

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

        return (<List className={classes.root}>
            {allCurrencies}
        </List>)
    }
}

const CurrencyEditor = withStyles(styles)(CurrencyEditorWidget);

class SettingEditor extends Component {
    onPrimaryCurrencyChange(value) {
        this.props.actions.setPrimaryCurrency(value);
    }

    onCloseTransactionDialogChange(value) {
        this.props.actions.setCloseTransactionDialog(value);
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

        var currencies = props.currency.get('currencies').filter((v) => v.get('active')).map((v, k) => {
            return (
                <MenuItem value={k} key={k}>{v.get('name')}</MenuItem>
            )
        }).valueSeq().toJS();

        return (<Fragment>
            <Row>
                <Col xs={12} sm={6} md={4} lg={4}>
                    <p>Primary currency:</p>
                </Col>
                <Col xs={12} sm={6} md={4} lg={4}>
                    <Select
                        value={props.primaryCurrency}
                        onChange={(ev) => ::this.onPrimaryCurrencyChange(ev.target.value)}
                    >
                        {currencies}
                    </Select>
                </Col>
            </Row>
            <Row>
                <Col xs={6} sm={6} md={4} lg={4}>
                    <p>By default close transaction dialog:</p>
                </Col>
                <Col xs={6} sm={6} md={4} lg={4}>
                    <Checkbox checked={this.props.closeTransactionDialog}
                              onChange={(ev, value) => ::this.onCloseTransactionDialogChange(value)}/>
                </Col>
            </Row>
            <Row>
                <Col xs={6} sm={6} md={4} lg={4}>
                    <p>Reindex transactions search data:</p>
                </Col>
                <Col xs={6} sm={6} md={4} lg={4}>
                    <Button color='primary' onClick={::this.onReindexClick}>Start reindex</Button>
                </Col>
            </Row>
        </Fragment>)
    }
}

class SettingsPage extends Component {
    render() {
        const props = this.props;

        return (
            <Grid fluid>
                <SettingEditor ui={props.setting.get('ui')} currency={props.currency}
                               primaryCurrency={props.primaryCurrency}
                               closeTransactionDialog={props.closeTransactionDialog}
                               actions={props.actions}/>
                <Divider/>
                <Row>
                    <Col xs={12} sm={6} md={4} lg={4}>
                        <p>Active currencies:</p>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={4}>
                        <CurrencyEditor currency={props.currency} currencyActions={this.props.currencyActions}/>
                    </Col>
                </Row>
                <Divider/>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <CategoryViewer/>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default withStyles(styles)(SettingsPage)
