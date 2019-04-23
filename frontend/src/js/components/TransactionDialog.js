import React,{Fragment} from 'react';
import mathjs from 'mathjs';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {Grid, Row, Col} from 'react-flexbox-grid';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import moment from 'moment';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DatePicker from 'react-date-picker'
import TimePicker from 'react-time-picker';
import Checkbox from '@material-ui/core/Checkbox';
import RSelect from 'react-select';

import {AccountMapper} from '../util/AccountUtils'

class SimpleOperationsEditor extends React.Component {
    render() {
        const props = this.props;

        //const errors = props.errors;
        const operations = props.operations;

        var textLabel = 'Amount';
        var textError = false;
        /*if (errors.get('operations')[1].amount) {
            textLabel = errors.get('operations')[1].amount;
            textError = true
        }*/

        var textLeftLabel = 'Source';
        var textLeftError = false;
        /*if (errors.get('operations')[0].account_id) {
            textLeftLabel = errors.get('operations')[0].account_id;
            textLeftError = true
        }*/

        var textRightLabel = 'Destination';
        var textRightError = false;
        /*if (errors.get('operations')[1].account_id) {
            textRightLabel = errors.get('operations')[1].account_id;
            textRightError = true
        }*/

        return (
            <Grid fluid>
                <Row>
                    <Col xs={5} sm={5} md={5} lg={4}>
                        <FormControl error={textLeftError} fullWidth={true}>
                            <InputLabel htmlFor={'source-simple'}>{textLeftLabel}</InputLabel>
                            <Select value={operations[0].account_id}
                                    onChange={(ev) => props.onAccountFunc(0, ev.target.value)}
                                    inputProps={{id: 'source-simple'}}>
                                {props.accounts.getAccounts()}
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
                                    onChange={(ev) => props.onAccountFunc(1, ev.target.value)}
                                    inputProps={{id: 'destination-simple'}}>
                                {props.accounts.getLimitedAccounts(operations[0])}
                            </Select>
                        </FormControl>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

class FullOperationsEditor extends React.Component {
    checkRateDisabled(operation) {
        const props = this.props;
        // First check - if we only have ops in same currency, rate should be definitely disabled.
        var accounts = props.accounts.accounts;
        var currencies = props.operations
            .map((item) => item.account_id)
            .filter((item) => !(item === undefined))
            .map((acc_id) => accounts.get(acc_id))
            .filter((item) => !(item === undefined))
            .map((item) => item.get('currency_id'))
            .filter((value, index, self) => self.indexOf(value) === index);
        if (currencies.length <= 1) {
            return true
        }

        //Second check - in case our currency is the primary currency
        if (accounts.has(operation.account_id)) {
            if (accounts.get(operation.account_id).get('currency_id') === props.primaryCurrency) {
                return true;
            }
        }

        //Third check - in case we don't have any op with primary currency
        //we should disable rate for all ops, having same currency as the first
        //op of the transaction
        var txCurrencies = props.operations
            .map((item) => item.account_id)
            .filter((item) => !(item === undefined || item === -1))
            .map((acc_id) => accounts.get(acc_id))
            .map((item) => item.get('currency_id'))
            .filter((value, index, self) => self.indexOf(value) === index)
            .filter((item) => item === props.primaryCurrency);
        if (txCurrencies.length === 0) {
            //Ok, we do not have primary currency at the transaction
            if (props.operations.length > 0) {
                if (accounts.has(props.operations[0].account_id)) {
                    var firstCurrency = accounts.get(props.operations[0].account_id);
                    if (firstCurrency === accounts.get(operation.account_id)) {
                        return true
                    }
                }
            }
        }

        return false;
    }

    render() {
        const parent = this;
        const props = this.props;
        //const errors = props.errors;

        var ops = this.props.operations.map(function (item, index) {
            var textLabel = 'Amount';
            var textError = false;
            /*if (errors.get('operations')[index].amount) {
                textLabel = errors.get('operations')[index].amount;
                textError = true
            }*/

            var textRateLabel = 'Rate';
            var textRateError = false;
            /*if (errors.get('operations')[index].rate) {
                textRateLabel = errors.get('operations')[index].rate;
                textRateError = true
            }*/

            var textAccountLabel = 'Account';
            var textAccountError = false;
            /*if (errors.get('operations')[index].account_id) {
                textAccountLabel = errors.get('operations')[index].account_id;
                textAccountError = true
            }*/

            return (
                <Grid fluid key={'op'+index}>
                    <Row>
                        <Col xs={4} sm={4} md={4} lg={4}>
                            <TextField label={textLabel} error={textError} value={item.amount}
                                       onChange={(ev) => props.onAmountFunc(index, ev.target.value)}/>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4}>
                            <TextField label={textRateLabel} error={textRateError} value={item.rate}
                                       onChange={(ev) => props.onRateFunc(index, ev.target.value)}
                                       disabled={parent.checkRateDisabled(item)}/>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4}>
                            <FormControl error={textAccountError} fullWidth={true}>
                                <InputLabel htmlFor={'destination-simple'}>{textAccountLabel}</InputLabel>
                                <Select value={item.account_id}
                                        onChange={(ev) => props.onAccountFunc(index, ev.target.value)}
                                        inputProps={{id: 'destination-simple'}}>
                                    {props.accounts.getAccounts()}
                                </Select>
                            </FormControl>
                        </Col>
                    </Row>
                </Grid>)
        });

        return (
            <Fragment>
                {ops}
                    <Grid fluid>
                        <Row>
                            <Col xs={1} xsOffset={5} sm={1} smOffset={5} md={1} mdOffset={5} lg={1}
                                 lgOffset={5}>
                                <IconButton onClick={props.operationAddFunc}><PlaylistAdd/></IconButton>
                            </Col>
                        </Row>
                    </Grid>
            </Fragment>
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

    onSaveCloseOnSave(value) {
      this.props.actions.setCloseOnSave(value)
    }

    onChange(field, value) {
        const tx = this.props.transaction.set(field, value);
        this.props.actions.editTransactionChange(tx);
    }

    onTagEdit(value) {
        const tags = value.map((item) => item.value);
        this.onChange('tags', tags)
    }

    onDateChange(date) {
        const newDate = moment(date);
        const dt = moment(this.props.transaction.get('timestamp'));
        dt.set({
            year: newDate.get('year'),
            month: newDate.get('month'),
            date: newDate.get('date')
        });
        this.onChange('timestamp', dt.format('YYYY-MM-DDTHH:mm:ss'));
    }

    onTimeChange(time) {
        const newDate = moment(time, 'HH:mm');
        const dt = moment(this.props.transaction.get('timestamp'));
        dt.set({
            hour: newDate.get('hour'),
            minute: newDate.get('minute')
        });
        this.onChange('timestamp', dt.format('YYYY-MM-DDTHH:mm:ss'));

    }

    onOperationAdd() {
        const ops = this.props.transaction.get('operations');
        ops.push({amount: 0, account_id: -1});
        this.onChange('operations', ops);
    }

    static evaluateEquation(value) {
        if (value) {
            const strAmount = value.toString();
            if (strAmount.slice(-1) === '=') { //If it ends with =
                var expr = strAmount.slice(0, -1); //Strip the = and evaluate mathematical expression
                try {
                    value = mathjs.eval(expr).toFixed(2)
                } catch (e) {
                    value = expr
                }
            }
        }
        return value
    }

    onCombinedAmountChange(ev) {
        const value = TransactionDialog.evaluateEquation(ev.target.value);

        const ops = this.props.transaction.get('operations');
        ops[0].amount = -1 * value;
        ops[1].amount = value;
        this.onChange('operations', ops);
    }

    onAmountChange(index, value) {
        const ops = this.props.transaction.get('operations');
        ops[index].amount = TransactionDialog.evaluateEquation(value);
        this.onChange('operations', ops);
    }


    validForSimpleEditing() {
        var props = this.props;
        var transaction = props.transaction;

        if (transaction.get('operations').length > 2) {
            return false
        }

        /*var accounts = props.assetAccounts.concat(props.expenseAccounts, props.incomeAccounts);
        var leftCurrency = accounts.filter((item) => item.id === attributes.operations[0].account_id).map((item) => item.attributes.currency_id);
        var rightCurrency = accounts.filter((item) => item.id === attributes.operations[1].account_id).map((item) => item.attributes.currency_id);
        if (leftCurrency.length > 0 && rightCurrency.length > 0) {
            return leftCurrency[0] === rightCurrency[0]
        }*/
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

    onAccountChange(index, value) {
        const ops = this.props.transaction.get('operations');
        ops[index].account_id = value;
        this.onChange('operations', ops)
    }


    render() {
        var props = this.props;
        var transaction = props.transaction;
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

        var onRateChange = function (/*index, value*/) {
            //attributes.operations[idex].rate = value;
            //var account = {...transaction, attributes: attributes};
            //props.actions.editTransactionChange(account);
        };

        const tags = props.tags.map((item) => {return {label: item.get('txtag'), value: item.get('txtag')}}).valueSeq().toJS();
        const selectedTags = transaction.get('tags').map((item) => {return {label: item, value: item}});

        const ts = moment(transaction.get('timestamp'));

        const accounts = new AccountMapper(props.currencies, props.categories, props.accounts);

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
                            <RSelect options={tags} isMulti={true} onChange={::this.onTagEdit} value={selectedTags}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <TextField label='Comment on transaction' fullWidth={true} multiline={true} rows={4}
                                       value={transaction.get('comment')} onChange={(event) => ::this.onChange('comment', event.target.value)}/>
                        </Col>
                    </Row>
                </Grid>
                <Divider/>
                <Tabs value={this.state.tabValue} onChange={::this.switchTab}>
                    <Tab label='Simple' value='simple' disabled={!enableSimpleEditor}/>
                    <Tab label='Multiple operations' value='multi'/>
                </Tabs>
                {this.state.tabValue === 'simple' &&
                <SimpleOperationsEditor errors={errors}
                                        operations={transaction.get('operations')}
                                        onAmountFunc={::this.onCombinedAmountChange}
                                        onAccountFunc={::this.onAccountChange}
                                        accounts={accounts}/>}
                {this.state.tabValue === 'multi' && <FullOperationsEditor errors={errors}
                                                                          operations={transaction.get('operations')}
                                                                          onAmountFunc={::this.onAmountChange}
                                                                          onAccountFunc={::this.onAccountChange}
                                                                          onRateFunc={onRateChange}
                                                                          operationAddFunc={::this.onOperationAdd}
                                                                          primaryCurrency={props.primaryCurrency}
                                                                          accounts={accounts}/>}
                <Grid fluid>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12}>
                            <div style={validationErrorStyle}>{errors.get('transaction')}</div>
                        </Col>
                    </Row>
                </Grid>
            </DialogContent>
            <DialogActions>
                  <InputLabel htmlFor={'close-dialog'}>Close dialog on save</InputLabel>
                  <Checkbox checked={props.closeOnSave} inputProps={{id: 'close-dialog'}} onChange={(ev, value) => ::this.onSaveCloseOnSave(value)}/>
                <Button color='primary' disabled={!props.valid} onClick={::this.props.actions.editTransactionSave}>Save</Button>
                <Button color='secondary' onClick={::this.props.actions.editTransactionCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>)
    }
}
