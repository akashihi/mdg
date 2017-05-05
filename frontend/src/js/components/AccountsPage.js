import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {GridList} from 'material-ui/GridList';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';

import Account from './Account'

export default class AccountsPage extends Component {
    componentDidMount() {
        this.props.currencyActions.loadCurrencyList()
    }
    render() {
        var props = this.props;

        var accounts;
        if (props.waiting) {
            accounts = <CircularProgress/>
        } else if (props.error) {
            accounts = <h1>Unable to load account list</h1>
        } else {
            var asset = props.assetAccounts.map(function(item) {
                return (
                    <div key={item.id}><Account account={item} currencies={props.currencies}/><Divider/></div>
                )
            });
            var income = props.incomeAccounts.map(function(item) {
                return (
                    <div key={item.id}><Account account={item} currencies={props.currencies}/><Divider/></div>
                )
            });
            var expense = props.expenseAccounts.map(function(item) {
                return (
                    <div key={item.id}><Account account={item} currencies={props.currencies}/><Divider/></div>
                )
            });

            accounts = <div>
                <h1>Asset accounts</h1>
                {asset}
                <h1>Income accounts</h1>
                {income}
                <h1>Expense accounts</h1>
                {expense}
            </div>
        }

        return (
            <Card>
                <CardHeader>
                    <Grid fluid>
                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4}>
                                <p>Total: {props.totals.total}</p>
                            </Col>
                            <Col xs={6} sm={6} md={4} lg={4}>
                                <p>Favorite: {props.totals.favorite}</p>
                            </Col>
                            <Col xs={6} sm={6} md={4} lg={4}>
                                <p>Operational: {props.totals.operational}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={3} lg={3}>
                                <RaisedButton label='Add new account'/>
                            </Col>
                            <Col xs={12} sm={12} mdOffset={6} md={3} lgOffset={6} lg={3}>
                                <FlatButton label='Show hidden accounts'/>
                            </Col>
                        </Row>
                    </Grid>
                </CardHeader>
                <CardText>

                    <GridList cellHeight={70} cols={1}>
                        {accounts}
                    </GridList>
                </CardText>
            </Card>
        )
    }
}
