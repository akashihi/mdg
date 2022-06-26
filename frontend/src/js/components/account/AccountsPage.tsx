import React, {useState, Fragment} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ClipLoader from 'react-spinners/ClipLoader';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import AccountEditor from '../../containers/AccountEditor';
import CategorizedAccountList from './CategorizedAccountList.js';
import {AccountsPageProps} from "../../containers/AccountsViewer";

function AccountsPage(props: AccountsPageProps) {
    const [tabValue, setTabValue] = useState('asset');

    /*const onHiddenAccountsClick = () => {
        props.actions.toggleHiddenAccounts(!props.hiddenVisible);
    };

    const onCreateAccountClick = () => {
        props.actions.createAccount();
    };

    const switchTab = (ev, value) => {
        setTabValue(value);
    };

    let accounts;
    if (props.waiting) {
        accounts = <ClipLoader sizeUnit={'px'} size={150} loading={true}/>;
    } else if (props.error) {
        accounts = <h1>Unable to load account list</h1>;
    } else {
        accounts =
            <Fragment>
                <Tabs value={tabValue} onChange={switchTab} centered scrollButtons='auto'>
                    <Tab label='Asset accounts' value='asset'/>
                    <Tab label='Income accounts' value='income'/>
                    <Tab label='Expense accounts' value='expense'/>
                </Tabs>
                {tabValue == 'asset' &&
                <CategorizedAccountList categoryList={props.categoryList} actions={props.actions}
                                        currencies={props.currencies} accounts={props.assetAccounts}
                                        hiddenVisible={props.hiddenVisible}/>}
                {tabValue == 'income' &&
                <CategorizedAccountList categoryList={props.categoryList} actions={props.actions}
                                        currencies={props.currencies} accounts={props.incomeAccounts}
                                        hiddenVisible={props.hiddenVisible}/>}
                {tabValue == 'expense' &&
                <CategorizedAccountList categoryList={props.categoryList} actions={props.actions}
                                        currencies={props.currencies} accounts={props.expenseAccounts}
                                        hiddenVisible={props.hiddenVisible}/>}
            </Fragment>
    }

    let hiddenButton;
    if (props.hiddenVisible) {
        hiddenButton =
            <Button color='primary' onClick={onHiddenAccountsClick}>Hide hidden accounts</Button>
    } else {
        hiddenButton =
            <Button color='primary' onClick={onHiddenAccountsClick}>Show hidden accounts</Button>
    }*/

    const cardStyle = {
        'marginTop': 15,
        'height': 120
    };
    return (
        <div>
            {/*<AccountEditor/>*/}
            <Card sx={cardStyle}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                            <p>Total: {props.totals.total} {props.primaryCurrencyName}</p>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={4} className='hide-on-small'>
                            <p>Favorite: {props.totals.favorite} {props.primaryCurrencyName}</p>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={4} className='hide-on-small hide-on-medium'>
                            <p>Operational: {props.totals.operational} {props.primaryCurrencyName}</p>
                        </Grid>
                        {/*<Grid item xs={12} sm={12} md={6} lg={3}>
                            <Button aria-label='Add account' color='secondary' onClick={onCreateAccountClick}>Add
                                account</Button>
                        </Grid>*/}
                        {/*<Grid item xs={12} sm={12} md={6} lgOffset={6} lg={3} className='hide-on-small'>
                            {hiddenButton}
                        </Grid>*/}
                    </Grid>
                </CardContent>
            </Card>
            {/*accounts*/}
        </div>
    )
}

export default AccountsPage;
