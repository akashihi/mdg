import React, { Component } from 'react';

import {Grid, Row, Col} from 'react-flexbox-grid';
import Notification from './Notification'
import { Route } from 'react-router'

import TopBar from '../containers/TopBar'
import TransactionCreate from '../containers/TransactionCreate'
import Overview from './Overview';
import BudgetViewer from '../containers/BudgetViewer'
import AccountsViewer from '../containers/AccountsViewer'
import TransactionsViewer from '../containers/TransactionsViewer'
import SettingsViewer from '../containers/SettingsViewer'
import RateViewer from '../containers/RateViewer'

export default class Main extends Component {
    render() {
      return (
        <div>
          <TopBar store={this.props.store}/>
            <Grid fluid>
              <Row>
                <Col xs={12} sm={12} md={11} lg={11}>
                  <Route exact path='/' component={Overview}/>
                  <Route path='/budget' component={BudgetViewer}/>
                  <Route path='/transactions' component={TransactionsViewer}/>
                  <Route path='/accounts' component={AccountsViewer}/>
                  <Route path='/settings' component={SettingsViewer}/>
                </Col>
                <Col xs={0} sm={0} md={1} lg={1}>
                  <Row><RateViewer/></Row>
                </Col>
              </Row>
            </Grid>
            <TransactionCreate/>
            <Notification/>
        </div>
      )
    }
}
