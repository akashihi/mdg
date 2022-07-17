import React, { Fragment } from 'react';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import { AccountsOverviewProps } from '../../containers/AccountsOverview';
import Account from '../../containers/AccountItem';

function AccountsOverviewPanel(props: AccountsOverviewProps) {
    const accounts = props.accounts.map(a => (
        <Account
            key={a.id}
            account={a}
            edit={() => {
                /* nothing to edit*/
            }}
            previewMode={true}
        />
    ));
    return (
        <Fragment>
            <CardHeader title="Accounts" />
            <CardContent>{accounts}</CardContent>
        </Fragment>
    );
}

export default AccountsOverviewPanel;
