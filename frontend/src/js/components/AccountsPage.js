import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {GridList} from 'material-ui/GridList';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';

import Account from './Account'
import AccountEditor from '../containers/AccountEditor'

export default class AccountsPage extends Component {
    componentDidMount() {
        this.props.currencyActions.loadCurrencyList()
    }

    onHiddenAccountsClick() {
        this.props.actions.toggleHiddenAccounts(!this.props.hiddenVisible)
    }

    onCreateAccountClick() {
        this.props.actions.createAccount();
    }

    render() {
        var props = this.props;

        var onSwitchFavoriteClick = function (account, value) {
            account.attributes.favorite = value;
            props.actions.updateAccount(account);
        };

        var onSwitchOperationalClick = function (account, value) {
            account.attributes.operational = value;
            props.actions.updateAccount(account);
        };

        var onSwitchHiddenClick = function (account, value) {
            account.attributes.hidden = value;
            props.actions.updateAccount(account);
        };

        var onEditAccountClick = function (account) {
            props.actions.editAccount(account)
        };

        var accounts;
        if (props.waiting) {
            accounts = <CircularProgress/>
        } else if (props.error) {
            accounts = <h1>Unable to load account list</h1>
        } else {
            var asset = props.assetAccounts.map(function (item) {
                return (
                    <div key={item.id}><Account account={item} currencies={props.currencies}
                                                switchFavoriteFunc={onSwitchFavoriteClick}
                                                switchOperationalFunc={onSwitchOperationalClick}
                                                switchHiddenFunc={onSwitchHiddenClick}
                                                editAccountFunc={onEditAccountClick}/></div>
                )
            });
            var income = props.incomeAccounts.map(function (item) {
                return (
                    <div key={item.id}><Account account={item} currencies={props.currencies}
                                                switchHiddenFunc={onSwitchHiddenClick}
                                                editAccountFunc={onEditAccountClick}/></div>
                )
            });
            var expense = props.expenseAccounts.map(function (item) {
                return (
                    <div key={item.id}><Account account={item} currencies={props.currencies}
                                                switchHiddenFunc={onSwitchHiddenClick}
                                                editAccountFunc={onEditAccountClick}/></div>
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

        var hiddenButton;
        if (props.hiddenVisible) {
            hiddenButton = <FlatButton label='Hide hidden accounts' onClick={this.onHiddenAccountsClick.bind(this)}/>
        } else {
            hiddenButton = <FlatButton label='Show hidden accounts' onClick={this.onHiddenAccountsClick.bind(this)}/>
        }

        return (
            <div>
                <AccountEditor/>
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
                                    <RaisedButton label='Add new account' onClick={::this.onCreateAccountClick}/>
                                </Col>
                                <Col xs={12} sm={12} mdOffset={6} md={3} lgOffset={6} lg={3}>
                                    {hiddenButton}
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
            </div>
        )
    }
}
