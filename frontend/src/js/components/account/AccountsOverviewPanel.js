import React, {Fragment} from 'react';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import AccountList from './AccountList';

function AccountsOverviewPanel(props) {
    const accounts = props.assetAccounts.filter((item) => item.get('favorite'));

    return (
        <>
            <CardHeader title='Accounts'/>
            <CardContent>
                <AccountList preview hiddenVisible={false} actions={props.actions} currencies={props.currencies}
                             accounts={accounts}/>
            </CardContent>
        </>
    )
}

export default AccountsOverviewPanel;
