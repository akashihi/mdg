import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { push } from 'react-router-redux'

export default class TopBar extends Component {
  componentDidMount() {
    this.props.currencyActions.loadCurrencyList()
    this.props.settingActions.loadSettingList()
    this.props.budgetActions.loadBudgetList()
    this.props.tagActions.loadTagList()
  }

    setPath = function(path) {
      this.props.store.dispatch(push(path))
    }

    setSelectedColor(path) {
      if (this.props.path == path) {
        return '#008FD4'
      }
      else {
        return '#00BCD4'
      }
    }
    render() {
    var leftButtons = (
        <div>
            <FlatButton label='Overview' onClick={() => ::this.setPath('/')} backgroundColor={::this.setSelectedColor('/')}/>
            <FlatButton label='Budget' onClick={() => ::this.setPath('/budget')} backgroundColor={::this.setSelectedColor('/budget')}/>
            <FlatButton label='Transactions' onClick={() => ::this.setPath('/transactions')} backgroundColor={::this.setSelectedColor('/transactions')}/>
            <FlatButton label='Accounts' onClick={() => ::this.setPath('/accounts')} backgroundColor={::this.setSelectedColor('/accounts')}/>
        </div>
      )

      var rightButtons = (
        <div>
            <FlatButton label='Settings' onClick={() => ::this.setPath('/settings')} backgroundColor={::this.setSelectedColor('/settings')}/>
        </div>
      )
      return (
          <AppBar iconElementLeft={leftButtons} iconElementRight={rightButtons}/>
      )
    }
}
