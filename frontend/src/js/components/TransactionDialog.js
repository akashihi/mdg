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

    render() {

        var props = this.props;
        var transaction = props.transaction;
        var attributes = transaction.attributes;

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
            return (<GridTile key={transaction.id+item.account_id+index}>
                <Grid fluid>
                    <Row>
                        <Col xs={6} sm={6} md={6} lg={6}>
                            {item.amount}
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6}>
                            <SelectField hintText='Account' value={item.account_id} >
                                {accounts}
                            </SelectField>
                        </Col>
                    </Row>
                </Grid>
            </GridTile>)
        });

        return (<Dialog title='Transaction editing' open={props.open}>
            <Grid fluid>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <DatePicker hintText='Transaction date' container='inline' mode='landscape' value={ts.toDate()}/>
                        </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <TimePicker format='24hr' hintText='Transaction time' value={ts.toDate()}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <ChipInput
                            value={attributes.tags}
                            dataSource={tags}
                            hintText='Tags'
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <TextField hintText='Comment on transaction' fullWidth={true} multiLine={true} rows={4} value={attributes.comment}/>
                    </Col>
                </Row>
            </Grid>
            <Divider/>
            <GridList cellHeight={60} cols={1}>
                {ops}
                <GridTile>
                    <Grid fluid>
                        <Row>
                            <Col xs={1} xsOffset={5} sm={1} smOffset={5} md={1} mdOffset={5} lg={1} lgOffset={5}>
                                <IconButton><FontIcon className='material-icons'>playlist_add</FontIcon></IconButton>
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
