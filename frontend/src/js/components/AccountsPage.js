import React, {Component, Fragment} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ClipLoader from 'react-spinners/ClipLoader';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AccountEditor from '../containers/AccountEditor'
import AccountList from './AccountList'

export default class AccountsPage extends Component {
  constructor(props) {
      super(props);
      this.state = {
          tabValue: 'asset'
      };
  }

    onHiddenAccountsClick() {
        this.props.actions.toggleHiddenAccounts(!this.props.hiddenVisible)
    }

    onCreateAccountClick() {
        this.props.actions.createAccount();
    }

    switchTab(ev, value) {
        this.setState({
            tabValue: value,
        });
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
          accounts =
            <Fragment>
              <Tabs value={this.state.tabValue} onChange={::this.switchTab} centered>
                  <Tab label='Asset accounts' value='asset'/>
                  <Tab label='Income accounts' value='income'/>
                  <Tab label='Expense accounts' value='expense'/>
              </Tabs>
              {this.state.tabValue == 'asset' && <AccountList actions={props.actions} currencies={props.currencies} accounts={props.assetAccounts} hiddenVisible={props.hiddenVisible}/>}
              {this.state.tabValue == 'income' && <AccountList actions={props.actions} currencies={props.currencies} accounts={props.incomeAccounts} hiddenVisible={props.hiddenVisible}/>}
              {this.state.tabValue == 'expense' && <AccountList actions={props.actions} currencies={props.currencies} accounts={props.expenseAccounts} hiddenVisible={props.hiddenVisible}/>}
            </Fragment>
        }

        var hiddenButton;
        if (props.hiddenVisible) {
            hiddenButton = <Button onClick={this.onHiddenAccountsClick.bind(this)}>Hide hidden accounts</Button>
        } else {
            hiddenButton = <Button onClick={this.onHiddenAccountsClick.bind(this)}>Show hidden accounts</Button>
        }

        var primaryCurrencyName = props.currencies.filter((item) => item.id == props.primaryCurrency).map((item) => item.attributes.name)[0]

        return (
            <div>
                <AccountEditor/>
                <Card style={cardStyle}>
                    <CardContent>
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
                                    <Button aria-label='Add account' onClick={::this.onCreateAccountClick}><AddCircleOutline/></Button>
                                </Col>
                                <Col xs={12} sm={12} mdOffset={6} md={3} lgOffset={6} lg={3}>
                                    {hiddenButton}
                                </Col>
                            </Row>
                        </Grid>
                    </CardContent>
                </Card>
                {accounts}
            </div>
        )
    }
}
