import React, {Component, Fragment} from 'react';

import AccountList from './AccountList'

export default class AccountsList extends Component {
    render() {
        var props = this.props;

        var filtered_accounts = props.accounts.filter((item) => item.attributes.hidden === this.props.hiddenVisible)

        var cash_accounts = filtered_accounts.filter((item) => item.attributes.asset_type === 'cash')
        var current_accounts = filtered_accounts.filter((item) => item.attributes.asset_type === 'current')
        var savings_accounts = filtered_accounts.filter((item) => item.attributes.asset_type === 'savings')
        var deposit_accounts = filtered_accounts.filter((item) => item.attributes.asset_type === 'deposit')
        var credit_accounts = filtered_accounts.filter((item) => item.attributes.asset_type === 'credit')
        var debt_accounts = filtered_accounts.filter((item) => item.attributes.asset_type === 'debt')
        var broker_accounts = filtered_accounts.filter((item) => item.attributes.asset_type === 'broker')
        var tradable_accounts = filtered_accounts.filter((item) => item.attributes.asset_type === 'tradable')

        return (
            <Fragment>
              <p>Cash</p>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={cash_accounts} hiddenVisible={props.hiddenVisible}/>
              <p>Current</p>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={current_accounts} hiddenVisible={props.hiddenVisible}/>
              <p>Savings</p>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={savings_accounts} hiddenVisible={props.hiddenVisible}/>
              <p>Deposits</p>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={deposit_accounts} hiddenVisible={props.hiddenVisible}/>
              <p>Credits</p>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={credit_accounts} hiddenVisible={props.hiddenVisible}/>
              <p>Debts</p>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={debt_accounts} hiddenVisible={props.hiddenVisible}/>
              <p>Investment accounts</p>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={broker_accounts} hiddenVisible={props.hiddenVisible}/>
              <p>Tradable assets</p>
              <AccountList actions={props.actions} currencies={props.currencies} accounts={tradable_accounts} hiddenVisible={props.hiddenVisible}/>
            </Fragment>
        )
    }
}
