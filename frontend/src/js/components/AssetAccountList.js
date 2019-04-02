import React, {Component, Fragment} from 'react';

import AccountList from './AccountList'

export default class AccountsList extends Component {
    render() {
        const props = this.props;
        
        const filtered_accounts = props.accounts.filter((item) => item.get('hidden') === this.props.hiddenVisible)

        const cash_accounts = filtered_accounts.filter((item) => item.get('asset_type') === 'cash')
        const current_accounts = filtered_accounts.filter((item) => item.get('asset_type') === 'current')
        const savings_accounts = filtered_accounts.filter((item) => item.get('asset_type') === 'savings')
        const deposit_accounts = filtered_accounts.filter((item) => item.get('asset_type') === 'deposit')
        const credit_accounts = filtered_accounts.filter((item) => item.get('asset_type') === 'credit')
        const debt_accounts = filtered_accounts.filter((item) => item.get('asset_type') === 'debt')
        const broker_accounts = filtered_accounts.filter((item) => item.get('asset_type') === 'broker')
        const tradable_accounts = filtered_accounts.filter((item) => item.get('asset_type') === 'tradable')

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
