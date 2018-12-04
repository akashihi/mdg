import React, { Component, Fragment } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { push } from 'react-router-redux'

export default class TopBar extends Component {
  componentDidMount() {
    this.props.currencyActions.loadCurrencyList()
    this.props.settingActions.loadSettingList()
    this.props.budgetActions.loadBudgetList()
    this.props.tagActions.loadTagList()
    this.props.rateActions.loadRatesList()
  }

    setPath = function(path) {
      this.props.store.dispatch(push(path))
    }

    setSelectedStyle(path) {
      if (this.props.path == path) {
        return 'outlined'
      }
      else {
        return 'text'
      }
    }
    render() {
    var leftButtons = (
        <Fragment>
            <Button onClick={() => ::this.setPath('/')} variant={::this.setSelectedStyle('/')} color='inherit'>Overview</Button>
            <Button onClick={() => ::this.setPath('/budget')} variant={::this.setSelectedStyle('/budget')} color='inherit'>Budget</Button>
            <Button onClick={() => ::this.setPath('/transactions')} variant={::this.setSelectedStyle('/transactions')} color='inherit'>Transactions</Button>
            <Button onClick={() => ::this.setPath('/reports')} variant={::this.setSelectedStyle('/reports')} color='inherit'>Reports</Button>
            <Button onClick={() => ::this.setPath('/accounts')} variant={::this.setSelectedStyle('/accounts')} color='inherit'>Accounts</Button>
        </Fragment>
      )

      var rightButtons = (
        <Fragment>
            <Button onClick={() => ::this.setPath('/settings')} variant={::this.setSelectedStyle('/settings')} color='inherit'>Settings</Button>
        </Fragment>
      )
      return (
          <AppBar position='static'>
            <Toolbar>
              <Typography type='title' color='inherit' style={{ flex: 1 }}>
              {leftButtons}
            </Typography>
              {rightButtons}
            </Toolbar>
          </AppBar>
      )
    }
}
