import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';


import {timestampToFormattedDate} from '../util/DateUtil'
import Operation from './Operation'

export default class Transaction extends Component {
    renderTransactionAccountList(operations, accounts) {
        //Tx account list should include only non-asset
        //account.
        //If transaction is built only of asset accounts,
        //they should be used
        var opAcounts = operations.map((item) => item.account_id);
        var usedAccounts = accounts.filter((item) => opAcounts.includes(item.id));

        var nonAssetAccounts = usedAccounts.filter((item) => item.attributes.account_type != 'asset');
        if (nonAssetAccounts.length > 0) {
            return nonAssetAccounts.map((item) => item.attributes.name).join(', ')
        } else {
            return usedAccounts.map((item) => item.attributes.name).join(', ')
        }
    }

    renderOperations(tx, accounts) {
        return tx.attributes.operations.map(function (item) {
            return (
                <div key={tx.id + '-' + item.account_id}><Operation operation={item} accounts={accounts}/></div>
            )
        });
    }

    getTotalChange(tx, accounts) {
        //We need to calculate totals for all
        //types of accounts.
        //
        //If sum of 'asset' is positive in the tx and
        //at least on of other sums is not negative, it
        //is a 'earn' transaction.
        //
        //if sum of 'asset' is negative it's a 'spending'
        //transaction.
        //
        //if sum of 'asset' is zero and sum of 'expense' is
        //positive, it is still spending.
        //
        //In other cases it's a 'transfer' transaction.

        var summary = tx.attributes.operations.map((op) => {
            var opAccount = accounts.filter((item) => item.id == op.account_id)[0];
            return {amount: op.amount, rate: op.rate, type: opAccount.attributes.account_type}
        }).reduce((acc, item) => {
          var amount = item.amount
          if (item.rate) {
            amount = amount * item.rate
          }
          acc[item.type] += amount;
          return acc
        }, {asset: 0, income: 0, expense: 0});

        if (summary['asset'] > 0 && (summary['income'] != 0 || summary['expense'] != 0)) {
            return {color: 'green', total: summary['asset'].toFixed(2)};
        }

        if (summary['asset'] < 0) {
            return {color: 'red', total: summary['asset'].toFixed(2)};
        }

        if (summary['asset'] == 0 && summary['expense'] > 0) {
            return {color: 'red', total: summary['expense'].toFixed(2)};
        }

        var positives = tx.attributes.operations.map((op) => {
            var opAccount = accounts.filter((item) => item.id == op.account_id)[0];
            return {amount: op.amount, rate: op.rate, type: opAccount.attributes.account_type}
        }).filter((item) => item.amount > 0)
            .reduce((acc, item) => {
              var amount = item.amount
              if (item.rate) {
                amount = amount * item.rate
              }
              acc[item.type] += amount; return acc
            }, {asset: 0, income: 0, expense: 0});

        if (positives['asset'] != 0) {
            return {color: 'yellow', total: positives['asset'].toFixed(2)};
        }

        if (positives['income'] != 0) {
            return {color: 'yellow', total: positives['income'].toFixed(2)};
        }

        if (positives['income'] != 0) {
            return {color: 'yellow', total: positives['income'].toFixed(2)};
        }

        return {color: 'black', total: 0}
    }

    render() {
        var props = this.props;
        var attributes = props.transaction.attributes;

        var operations = ::this.renderOperations(props.transaction, props.accounts);
        var totals = ::this.getTotalChange(props.transaction, props.accounts);

        return <Card>
            <CardHeader
                actAsExpander={false}
                showExpandableButton={true}>
                <Grid>
                    <Row>
                        <Col xs={1}><Checkbox/></Col>
                        <Col xs={1}>{timestampToFormattedDate(attributes.timestamp)}</Col>
                        <Col xs={3}>{attributes.comment}</Col>
                        <Col xs={2}>
                            <div style={{color: totals.color}}>{totals.total}</div>
                        </Col>
                        <Col xs={2}>{::this.renderTransactionAccountList(attributes.operations, props.accounts)}</Col>
                        <Col xs={2}>{attributes.tags.join(', ')}</Col>
                        <Col xs={1}>
                            <IconButton onClick={() => props.editAction(props.transaction)}><FontIcon className='material-icons'>mode_edit</FontIcon></IconButton>
                            <IconButton onClick={() => props.deleteAction(props.transaction)}><FontIcon className='material-icons'>delete</FontIcon></IconButton>
                        </Col>
                    </Row>
                </Grid>
            </CardHeader>
            <CardText expandable={true}>
                <Grid>
                    {operations}
                </Grid>
            </CardText>
        </Card>;
    }
}
