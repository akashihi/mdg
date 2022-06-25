import React, {Fragment} from 'react';

import Account from './Account';

function AccountsList(props) {
    const onSwitchClick = (id, account) => {
        return function (field) {
            account = account.set(field, !account.get(field));
            props.actions.updateAccount(id, account);
        };
    };

    const filteredAccounts = props.accounts.filter((item) => item.get('hidden') === props.hiddenVisible);

    const accounts = filteredAccounts.map(function (item, k) {
        return (
            <div key={k}><Account
                preview={props.preview} account={item} currencies={props.currencies}
                switchFunc={onSwitchClick(k, item)}
                editAccountFunc={() => props.actions.editAccount(k, item)}
            />
            </div>
        )
    }).valueSeq();

    return (
        <>{accounts}</>
    )
}

export default AccountsList;
