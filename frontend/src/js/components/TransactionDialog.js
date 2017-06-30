import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ChipInput from 'material-ui-chip-input'
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {GridList, GridTile} from 'material-ui/GridList';
import moment from 'moment';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class TransactionDialog extends React.Component {
    onCancelClick() {
        this.props.actions.editTransactionCancel();
    }

    onCommentChange(event, key, value) {
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

    onDateChange(ev, date) {
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

    onTimeChange(ev, date) {
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

    render() {
        var props = this.props;
        var transaction = props.transaction;
        var attributes = transaction.attributes;
        var errors = props.errors;

        var validationErrorStyle = {
            'position': 'relative',
            'bottom': '-2px',
            'font-size': '12px',
            'line-height': '12px',
            'color': 'rgb(244, 67, 54)',
            'transition': 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        };

        var onAmountChange=function(index, value) {
            attributes.operations[index].amount = value;
            var account = {...transaction, attributes: attributes};
            props.actions.editTransactionChange(account);
        };


        var onAccountChange = function (index, value) {
            attributes.operations[index].account_id = value;
            var account = {...transaction, attributes: attributes};
            props.actions.editTransactionChange(account);
        };

        var tags = props.tags.map((item) => item.attributes.txtag);

        var ts = moment(attributes.timestamp);

        var accounts = props.assetAccounts.concat(props.expenseAccounts, props.incomeAccounts).map((item) => {
            var currencyIndex = props.currencies.map((c) => c.id).indexOf(item.attributes.currency_id);
            var currencyName='';
            if (currencyIndex > -1) {
                currencyName='('+props.currencies[currencyIndex].attributes.name+')'
            }
            return (<MenuItem key={item.id} value={item.id} primaryText={item.attributes.name + currencyName} />)
        });

        var ops = attributes.operations.map(function(item, index) {
            return (<GridTile key={transaction.id+index}>
                <Grid fluid>
                    <Row>
                        <Col xs={6} sm={6} md={6} lg={6}>
                            <TextField hintText='Amount' errorText={errors.operations[index].amount} value={item.amount} onChange={(ev, value) => onAmountChange(index, value)}/>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6}>
                            <SelectField hintText='Account' errorText={errors.operations[index].account_id} value={item.account_id} onChange={(ev, key, value) => onAccountChange(index,value)}>
                                {accounts}
                            </SelectField>
                        </Col>
                    </Row>
                </Grid>
            </GridTile>)
        });

        return (<Dialog title='Transaction editing' open={props.open} autoScrollBodyContent={true}>
            <Grid fluid>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <DatePicker hintText='Transaction date' container='inline' mode='landscape' value={ts.toDate()} onChange={::this.onDateChange}/>
                        </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <TimePicker format='24hr' hintText='Transaction time' value={ts.toDate()} onChange={::this.onTimeChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <ChipInput
                            value={attributes.tags}
                            dataSource={tags}
                            hintText='Tags'
                            onRequestAdd={::this.onTagAdd}
                            onRequestDelete={::this.onTagDelete}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <TextField hintText='Comment on transaction' fullWidth={true} multiLine={true} rows={4} value={attributes.comment} onChange={::this.onCommentChange}/>
                    </Col>
                </Row>
            </Grid>
            <Divider/>
            <GridList cellHeight={60} cols={1}>
                {ops}
                <GridTile>
                    <Grid fluid>
                        <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                                <div style={validationErrorStyle}>{errors.transaction}</div>
                            </Col>
                         </Row>
                        <Row>
                            <Col xs={1} xsOffset={5} sm={1} smOffset={5} md={1} mdOffset={5} lg={1} lgOffset={5}>
                                <IconButton onClick={::this.onOperationAdd}><FontIcon className='material-icons'>playlist_add</FontIcon></IconButton>
                            </Col>
                        </Row>
                    </Grid>
                </GridTile>
            </GridList>
            <FlatButton label='Save' primary={true} disabled={!props.valid}/>
            <FlatButton label='Cancel' secondary={true} onClick={::this.onCancelClick}/>
        </Dialog>)
    }
}
