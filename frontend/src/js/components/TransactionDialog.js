import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {Grid, Row, Col} from 'react-flexbox-grid';
//import ChipInput from 'material-ui-chip-input'
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import {GridList, GridTile} from 'material-ui/GridList';
import moment from 'moment';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DatePicker from 'react-date-picker'
import TimePicker from 'react-time-picker';


class SimpleOperationsEditor extends React.Component {
    render() {
        const props = this.props;

        const accounts = props.accounts;
        const limitedAccounts = props.limitedAccounts;
        const errors = props.errors;
        const operations = props.operations;

        var textLabel = 'Amount';
        var textError = false;
        if (errors.operations[1].amount) {
            textLabel = errors.operations[1].amount;
            textError = true
        }

        var textLeftLabel = 'Source';
        var textLeftError = false;
        if (errors.operations[0].account_id) {
            textLeftLabel = errors.operations[0].account_id;
            textLeftError = true
        }

        var textRightLabel = 'Destination';
        var textRightError = false;
        if (errors.operations[1].account_id) {
            textRightLabel = errors.operations[1].account_id;
            textRightError = true
        }

        return (
            <Grid fluid>
                <Row>
                    <Col xs={5} sm={5} md={5} lg={4}>
                        <FormControl error={textLeftError} fullWidth={true}>
                            <InputLabel htmlFor={'source-simple'}>{textLeftLabel}</InputLabel>
                            <Select value={operations[0].account_id}
                                    onChange={(ev) => props.onAccountFunc(0, ev.target.value)}
                                    inputProps={{id: 'source-simple'}}>
                                {accounts}
                            </Select>
                        </FormControl>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                        <TextField label={textLabel} error={textError} value={operations[1].amount}
                                   onChange={props.onAmountFunc}/>
                    </Col>
                    <Col xsOffset={1} xs={5} sm={5} md={5} lg={4}>
                        <FormControl error={textRightError} fullWidth={true}>
                            <InputLabel htmlFor={'destination-simple'}>{textRightLabel}</InputLabel>
                            <Select value={operations[1].account_id}
                                    onChange={(ev) => props.onAccountFunc(1, ev.target.value)} inputProps={{id: 'destination-simple'}}>
                                {limitedAccounts}
                            </Select>
                        </FormControl>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default class TransactionDialog extends React.Component {
    constructor(props) {
        super(props);
        var tab = 'simple';
        if (!this.validForSimpleEditing(this.props.transaction)) {
            tab = 'multi'
        }

        this.state = {
            tabValue: tab,
        };
    }

    onSaveClick() {
        this.props.actions.editTransactionSave();
    }

    onCancelClick() {
        this.props.actions.editTransactionCancel();
    }

    onCommentChange(event, value) {
        var attr = {...this.props.transaction.attributes};
        attr.comment = value;
        var tx = {...this.props.transaction, attributes: attr};
        this.props.actions.editTransactionChange(tx);
    }

    onTagAdd(tag) {
        var attr = {...this.props.transaction.attributes};
        attr.tags.push(tag);
        var tx = {...this.props.transaction, attributes: attr};
        this.props.actions.editTransactionChange(tx);
    }

    onTagDelete(tag, index) {
        var attr = {...this.props.transaction.attributes};
        attr.tags.splice(index, 1);
        var tx = {...this.props.transaction, attributes: attr};
        this.props.actions.editTransactionChange(tx);
    }

    onDateChange(date) {
        var attr = {...this.props.transaction.attributes};
        var newDate = moment(date);
        var dt = moment(attr.timestamp);
        dt.set({
            year: newDate.get('year'),
            month: newDate.get('month'),
            date: newDate.get('date')
        });
        attr.timestamp = dt.format('YYYY-MM-DDTHH:mm:ss');
        var tx = {...this.props.transaction, attributes: attr};
        this.props.actions.editTransactionChange(tx);
    }

    onTimeChange(date) {
        var attr = {...this.props.transaction.attributes};
        attr.timestamp = moment(date).format('YYYY-MM-DDTHH:mm:ss');
        var tx = {...this.props.transaction, attributes: attr};
        this.props.actions.editTransactionChange(tx);
    }

    onOperationAdd() {
        var attr = {...this.props.transaction.attributes};
        attr.operations.push({amount: 0});
        var tx = {...this.props.transaction, attributes: attr};
        this.props.actions.editTransactionChange(tx);
    }

    onCombinedAmountChange(ev) {
        const value = ev.target.value;
        var attr = {...this.props.transaction.attributes};
        attr.operations[0].amount = -1 * value;
        attr.operations[1].amount = value;
        var account = {...this.props.transaction, attributes: attr};
        this.props.actions.editTransactionChange(account);
    }

    validForSimpleEditing() {
        var props = this.props;
        var transaction = props.transaction;
        var attributes = transaction.attributes;
        if (attributes.operations.length > 2) {
            return false
        }

        var accounts = props.assetAccounts.concat(props.expenseAccounts, props.incomeAccounts);
        var leftCurrency = accounts.filter((item) => item.id === attributes.operations[0].account_id).map((item) => item.attributes.currency_id);
        var rightCurrency = accounts.filter((item) => item.id === attributes.operations[1].account_id).map((item) => item.attributes.currency_id);
        if (leftCurrency.length > 0 && rightCurrency.length > 0) {
            return leftCurrency[0] === rightCurrency[0]
        }
        return true
    }

    switchTab(ev, value) {
        if (!this.validForSimpleEditing(this.props.transaction)) {
            value = 'multi'
        }
        this.setState({
            tabValue: value,
        });
    }

    accountToMenuItem(item) {
        var props = this.props;
        var currencyIndex = props.currencies.map((c) => c.id).indexOf(item.attributes.currency_id);
        var currencyName = '';
        if (currencyIndex > -1) {
            currencyName = '(' + props.currencies[currencyIndex].attributes.name + ')'
        }
        return (<MenuItem key={item.id} value={item.id}>{item.attributes.name + currencyName}</MenuItem>)
    }

    render() {
        var props = this.props;
        var transaction = props.transaction;
        var attributes = transaction.attributes;
        var errors = props.errors;

        var validationErrorStyle = {
            'position': 'relative',
            'bottom': '-2px',
            'fontSize': '12px',
            'lineHeight': '12px',
            'color': 'rgb(244, 67, 54)',
            'transition': 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        };

        var enableSimpleEditor = this.validForSimpleEditing(transaction);

        var onAmountChange = function (index, value) {
            attributes.operations[index].amount = value;
            var account = {...transaction, attributes: attributes};
            props.actions.editTransactionChange(account);
        };

        var onRateChange = function (index, value) {
            attributes.operations[index].rate = value;
            var account = {...transaction, attributes: attributes};
            props.actions.editTransactionChange(account);
        };

        var onAccountChange = function (index, value) {
            attributes.operations[index].account_id = value;
            var account = {...transaction, attributes: attributes};
            props.actions.editTransactionChange(account);
        };

        var checkRateDisabled = function (operation) {
            // First check - if we only have ops in same currency, rate should be definitely disabled.
            var accounts = props.assetAccounts.concat(props.expenseAccounts, props.incomeAccounts);
            var currencies = transaction.attributes.operations
                .map((item) => item.account_id)
                .filter((item) => !(item === undefined))
                .map((acc_id) => accounts.filter((item) => item.id === acc_id)[0])
                .map((item) => item.attributes.currency_id)
                .filter((value, index, self) => self.indexOf(value) === index)
            if (currencies.length <= 1) {
                return true
            }

            //Second check - in case our currency is the primary currency
            var myAccount = accounts.filter((item) => item.id === operation.account_id)
            if (myAccount.length > 0) {
                var myCurrency = myAccount[0].attributes.currency_id
            }
            if (myCurrency === props.primaryCurrency) {
                return true
            }

            //Third check - in case we don't have any op with primary currency
            //we should disable rate for all ops, having same currency as the first
            //op of the transaction
            var txCurrencies = transaction.attributes.operations
                .map((item) => item.account_id)
                .filter((item) => !(item === undefined))
                .map((acc_id) => accounts.filter((item) => item.id === acc_id)[0])
                .map((item) => item.attributes.currency_id)
                .filter((value, index, self) => self.indexOf(value) === index)
                .filter((item) => item === props.primaryCurrency)
            if (txCurrencies.length === 0) {
                //Ok, we do not have primary currency at the transaction
                if (transaction.attributes.operations.length > 0) {
                    var firstAccount = accounts.filter((item) => item.id === transaction.attributes.operations[0].account_id)
                    if (firstAccount.length > 0) {
                        var firstCurrency = firstAccount[0].attributes.currency_id
                        if (firstCurrency === myCurrency) {
                            return true
                        }
                    }
                }
            }

            return false
        };

        //var tags = props.tags.map((item) => item.attributes.txtag);

        var ts = moment(attributes.timestamp);

        var combinedAccounts = props.assetAccounts.concat(props.expenseAccounts, props.incomeAccounts);
        var limitedAccounts = combinedAccounts;
        if (attributes.operations[0].account_id) {
            var leftAccountsIndex = combinedAccounts.map((c) => c.id).indexOf(attributes.operations[0].account_id);
            if (leftAccountsIndex > -1) {
                var leftAccount = combinedAccounts[leftAccountsIndex];
                //Limit accounts of the second op, so they will always be of the same currency
                limitedAccounts = combinedAccounts.filter((item) => {
                    return item.attributes.currency_id === leftAccount.attributes.currency_id
                })
            }
        }

        var accounts = combinedAccounts.map(::this.accountToMenuItem);
        limitedAccounts = limitedAccounts.map(::this.accountToMenuItem);


        var ops = attributes.operations.map(function (item, index) {
            return (<GridTile key={index}>
                <Grid fluid>
                    <Row>
                        <Col xs={4} sm={4} md={4} lg={4}>
                            <TextField label='Amount' errorText={errors.operations[index].amount} value={item.amount}
                                       onChange={(ev, value) => onAmountChange(index, value)}/>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4}>
                            <TextField label='Rate' errorText={errors.operations[index].rate} value={item.rate}
                                       onChange={(ev, value) => onRateChange(index, value)}
                                       disabled={checkRateDisabled(item)}/>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4}>
                            <Select hintText='Account' errorText={errors.operations[index].account_id}
                                    value={item.account_id}
                                    onChange={(ev, key, value) => onAccountChange(index, value)}>
                                {accounts}
                            </Select>
                        </Col>
                    </Row>
                </Grid>
            </GridTile>)
        });

        var fullEditor = (
            <GridList cellHeight={60} cols={1}>
                {ops}
                <GridTile>
                    <Grid fluid>
                        <Row>
                            <Col xs={1} xsOffset={5} sm={1} smOffset={5} md={1} mdOffset={5} lg={1}
                                 lgOffset={5}>
                                <IconButton onClick={::this.onOperationAdd}><PlaylistAdd/></IconButton>
                            </Col>
                        </Row>
                    </Grid>
                </GridTile>
            </GridList>
        );

        return (<Dialog title='Transaction editing' open={props.open} scroll={'paper'} maxWidth={'md'} fullWidth={true}>
            <DialogContent>
                <Grid fluid>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <DatePicker value={ts.toDate()} onChange={::this.onDateChange}/>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6}>
                            <TimePicker value={ts.toDate()} onChange={::this.onTimeChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            {/*<ChipInput
                            value={attributes.tags}
                            dataSource={tags}
                            hintText='Tags'
                            onRequestAdd={::this.onTagAdd}
                            onRequestDelete={::this.onTagDelete}
                        />*/}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <TextField label='Comment on transaction' fullWidth={true} multiline={true} rows={4}
                                       value={attributes.comment} onChange={::this.onCommentChange}/>
                        </Col>
                    </Row>
                </Grid>
                <Divider/>
                <Tabs value={this.state.tabValue} onChange={::this.switchTab}>
                    <Tab label='Simple' value='simple' disabled={!enableSimpleEditor}/>
                    <Tab label='Multiple operations' value='multi'/>
                </Tabs>
                {this.state.tabValue === 'simple' &&
                <SimpleOperationsEditor accounts={accounts} limitedAccounts={limitedAccounts} errors={errors}
                                        operations={attributes.operations} onAmountFunc={::this.onCombinedAmountChange}
                                        onAccountFunc={onAccountChange}/>}
                {this.state.tabValue === 'multi' && fullEditor}
                <Grid fluid>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <div style={validationErrorStyle}>{errors.transaction}</div>
                        </Col>
                    </Row>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color='primary' disabled={!props.valid} onClick={::this.onSaveClick}>Save</Button>
                <Button color='secondary' onClick={::this.onCancelClick}>Cancel</Button>
            </DialogActions>
        </Dialog>)
    }
}
