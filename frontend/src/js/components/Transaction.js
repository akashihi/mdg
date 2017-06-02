import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Checkbox from 'material-ui/Checkbox';

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
        if (nonAssetAccounts.length>0) {
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

    render() {
        var props = this.props;
        var attributes = props.transaction.attributes;

        var operations = ::this.renderOperations(props.transaction, props.accounts);

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
                            <div style={{color: 'red'}}> -100500</div>
                        </Col>
                        <Col xs={2}>{::this.renderTransactionAccountList(attributes.operations, props.accounts)}</Col>
                        <Col xs={2}>{attributes.tags.join(', ')}</Col>
                        <Col xs={1}>Actions</Col>
                    </Row>
                </Grid>
            </CardHeader>
            <CardText expandable={true}>
                <Grid>
                    {operations}
                    <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                    <Row>
                        <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                        <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                    </Row>
                    <Row>
                        <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                        <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                    </Row>
                    <Row>
                        <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                        <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                    </Row>
                </Grid>
            </CardText>
        </Card>;
    }
}
