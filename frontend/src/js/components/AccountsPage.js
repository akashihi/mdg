import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {GridList} from 'material-ui/GridList';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';

import AccountEditor from '../containers/AccountEditor'
import AccountList from './AccountList'

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

        var accounts;
        if (props.waiting) {
            accounts = <CircularProgress/>
        } else if (props.error) {
            accounts = <h1>Unable to load account list</h1>
        } else {
            accounts = <div>
                <h1>Asset accounts</h1>
                <AccountList actions={props.actions} currencies={props.currencies} accounts={props.assetAccounts}/>
                <h1>Income accounts</h1>
                <AccountList actions={props.actions} currencies={props.currencies} accounts={props.incomeAccounts}/>
                <h1>Expense accounts</h1>
                <AccountList actions={props.actions} currencies={props.currencies} accounts={props.expenseAccounts}/>
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
                                    <IconButton onClick={::this.onCreateAccountClick}><FontIcon className='material-icons'>add_circle_outline</FontIcon></IconButton>
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
