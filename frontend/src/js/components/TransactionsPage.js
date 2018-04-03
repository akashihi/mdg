import React, {Component} from 'react';
import {Card, CardHeader, CardActions} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {GridList, GridTile} from 'material-ui/GridList';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';

import Transaction from './Transaction';
import TransactionPager from '../containers/TransactionsPager'
import TransactionFilter from '../containers/TransactionsFilter'
import TransactionDeleteDialog from '../containers/TransactionDeleteDialog'
import TransactionEditor from '../containers/TransactionEditor'

export default class TransactionsPage extends Component {

    makeAccountsList(props) {
        return props.assetAccounts.concat(props.expenseAccounts, props.incomeAccounts)
    }

    render() {
        var props = this.props;

        var accounts = ::this.makeAccountsList(props);

        var title = 'Showing transactions from ' + props.periodBeginning.format('DD-MM-YYYY') + ' till ' + props.periodEnd.format('DD-MM-YYYY');

        var transactions;
        if (props.waiting) {
            transactions = <CircularProgress/>;
        } else if (props.error) {
            transactions = <h1>Unable to load transactions list</h1>
        } else {
            transactions = props.transactions.map(function (item) {
                return (
                    <GridTile key={item.id}><Transaction transaction={item} accounts={accounts} editAction={props.actions.editTransaction} deleteAction={props.actions.deleteTransactionRequest}/></GridTile>
                )
            });
        }

        return <div>
            <TransactionDeleteDialog/>
            <TransactionEditor/>
            <Card>
                <CardHeader
                    title={title}
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardActions expandable={true}>
                    <TransactionFilter/>
                </CardActions>
            </Card>
            <Divider/>
            <GridList cols={1} cellHeight='auto'>
                <GridTile>
                    <Card>
                        <CardHeader>
                            <Grid>
                                <Row>
                                    <Col xs={1}/>
                                    <Col xs={1}>Date</Col>
                                    <Col xs={3}>Comment</Col>
                                    <Col xs={2}>Amount</Col>
                                    <Col xs={2}>Accounts</Col>
                                    <Col xs={2}>Tags</Col>
                                    <Col xs={1}/>
                                </Row>
                            </Grid>
                        </CardHeader>
                    </Card>
                </GridTile>
                {transactions}
            </GridList>
            <TransactionPager/>
        </div>;
    }
}
