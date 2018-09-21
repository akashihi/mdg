import React, {Component} from 'react';
import {Card, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ClipLoader from 'react-spinners/ClipLoader';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';

import AccountEditor from '../containers/AccountEditor'
import AccountList from './AccountList'

export default class AccountsPage extends Component {
    onHiddenAccountsClick() {
        this.props.actions.toggleHiddenAccounts(!this.props.hiddenVisible)
    }

    onCreateAccountClick() {
        this.props.actions.createAccount();
    }

    render() {
        var props = this.props;

        var cardStyle = {
            'marginTop': 15,
            'height': 120
        };

        var accounts;
        if (props.waiting) {
            accounts = <ClipLoader sizeUnit={'px'} size={150} loading={true}/>;
        } else if (props.error) {
            accounts = <h1>Unable to load account list</h1>
        } else {
            accounts = <Tabs>
                <Tab label='Asset accounts'>
                    <AccountList actions={props.actions} currencies={props.currencies} accounts={props.assetAccounts} hiddenVisible={props.hiddenVisible}/>
                </Tab>
                <Tab label='Income accounts'>
                    <AccountList actions={props.actions} currencies={props.currencies} accounts={props.incomeAccounts} hiddenVisible={props.hiddenVisible}/>
                </Tab>
                <Tab label='Expense accounts'>
                    <AccountList actions={props.actions} currencies={props.currencies} accounts={props.expenseAccounts} hiddenVisible={props.hiddenVisible}/>
                </Tab>
            </Tabs>
        }

        var hiddenButton;
        if (props.hiddenVisible) {
            hiddenButton = <FlatButton label='Hide hidden accounts' onClick={this.onHiddenAccountsClick.bind(this)}/>
        } else {
            hiddenButton = <FlatButton label='Show hidden accounts' onClick={this.onHiddenAccountsClick.bind(this)}/>
        }

        var primaryCurrencyName = props.currencies.filter((item) => item.id == props.primaryCurrency).map((item) => item.attributes.name)[0]

        return (
            <div>
                <AccountEditor/>
                <Card style={cardStyle}>
                    <CardText>
                        <Grid fluid>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={4}>
                                    <p>Total: {props.totals.total} {primaryCurrencyName}</p>
                                </Col>
                                <Col xs={6} sm={6} md={4} lg={4}>
                                    <p>Favorite: {props.totals.favorite} {primaryCurrencyName}</p>
                                </Col>
                                <Col xs={6} sm={6} md={4} lg={4}>
                                    <p>Operational: {props.totals.operational} {primaryCurrencyName}</p>
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
                    </CardText>
                </Card>
                {accounts}
            </div>
        )
    }
}
