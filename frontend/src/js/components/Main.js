import React, { Component } from 'react';

import {Grid, Row, Col} from 'react-flexbox-grid';
import { Route, Switch } from 'react-router'
import NotificationSystem from 'react-notification-system'

import TopBar from '../containers/TopBar'
import TransactionCreate from '../containers/TransactionCreate'
import Overview from './Overview';
import BudgetViewer from '../containers/BudgetViewer'
import AccountsViewer from '../containers/AccountsViewer'
import TransactionsViewer from '../containers/TransactionsViewer'
import SettingsViewer from '../containers/SettingsViewer'
import RateViewer from '../containers/RateViewer'
import TransactionEditor from '../containers/TransactionEditor'
import ReportsViewer from '../containers/ReportsViewer'

window.notifications = React.createRef();

export default class Main extends Component {
    render() {
      return (
        <div>
          <TopBar/>
            <Grid fluid>
              <Row>
                <Col xs={12} sm={12} md={11} lg={11}>
                  <Switch>
                    <Route exact path='/' component={Overview}/>
                    <Route path='/budget' component={BudgetViewer}/>
                    <Route path='/transactions' component={TransactionsViewer}/>
                    <Route path='/reports' component={ReportsViewer}/>
                    <Route path='/accounts' component={AccountsViewer}/>
                    <Route path='/settings' component={SettingsViewer}/>
                  </Switch>
                </Col>
                <Col xs={0} sm={0} md={1} lg={1} className='hide-on-medium'>
                  <Row><RateViewer/></Row>
                </Col>
              </Row>
            </Grid>
            <TransactionCreate/>
            <TransactionEditor/>
            <NotificationSystem ref={e => (window.notification = e)} />
        </div>
      )
    }
}
