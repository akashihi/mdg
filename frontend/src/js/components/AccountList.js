import React, {Component, Fragment} from 'react';

import Account from './Account'

export default class AccountsList extends Component {
  onSwitchClick(id, account){
    const props = this.props;
    return function(field) {
      account = account.set(field, !account.get(field))      
      props.actions.updateAccount(id, account);
    }
  }

    render() {
        const props = this.props;
        const ths = this

        var onEditAccountClick = function (account) {
            props.actions.editAccount(account)
        };

        var filtered_accounts = props.accounts.filter((item) => item.get('hidden') === this.props.hiddenVisible)

        var accounts = filtered_accounts.map(function (item, k) {
            return (
                <div key={k}><Account account={item} currencies={props.currencies}
                                            switchFunc={ths.onSwitchClick(k, item)}
                                            editAccountFunc={onEditAccountClick}/></div>
            )
        }).valueSeq();
        return (
            <Fragment>{accounts}</Fragment>
        )
    }
}
