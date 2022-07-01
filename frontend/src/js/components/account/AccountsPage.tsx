import React, {useState, Fragment} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import AccountEditor from '../../containers/AccountEditor';
import CategorizedAccountList from './CategorizedAccountList';
import {AccountsPageProps} from "../../containers/AccountsViewer";
import {Account} from "../../models/Account";


function AccountsPage(props: AccountsPageProps) {
    const emptyAccount: Account =  { id: -1, name: '', account_type: 'ASSET', balance: 0, currency_id: props.primaryCurrencyId, operational: false, favorite:false, primary_balance: 0 };

    const [showHidden, setShowHidden] = useState(false);
    const [tabValue, setTabValue] = useState('asset');
    const [showEditor, setShowEditor] = useState(false);
    const [fullEditor, setFullEditor] = useState(false);
    const [editedAccount, setEditedAccount] = useState<Account>(emptyAccount);

    const onCreateAccountClick = () => {
        setShowEditor(true);
        setFullEditor(true);
        setEditedAccount(emptyAccount)
    }

    const onEditAccountClick = (account: Account) => {
        setShowEditor(true);
        setFullEditor(false);
        setEditedAccount(account)
    }

    let hiddenButton;
    if (showHidden) {
        hiddenButton = <Button color='primary' onClick={() => setShowHidden(false)}>Hide hidden accounts</Button>
    } else {
        hiddenButton = <Button color='primary' onClick={() => setShowHidden(true)}>Show hidden accounts</Button>
    }

    return (
        <Fragment>
            <Backdrop open={!props.available}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AccountEditor account={editedAccount} full={fullEditor} open={showEditor} close={()=> setShowEditor(false)}/>
            <Card sx={{
                marginTop: '15px',
                height: 120
            }}>
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
                        <Grid item xs={12} sm={12} md={6} lg={3} className='hide-on-small'>
                            {hiddenButton}
                        </Grid>
                        <Grid item lg={6} className='hide-on-small hide-on-medium'/>
                        <Grid item xs={12} sm={12} md={6} lg={3}>
                            <Button aria-label='Add account' color='secondary' onClick={onCreateAccountClick}>Add account</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)} centered scrollButtons='auto'>
                <Tab label='Asset accounts' value='asset'/>
                <Tab label='Income accounts' value='income'/>
                <Tab label='Expense accounts' value='expense'/>
            </Tabs>
            {tabValue == 'asset' && <CategorizedAccountList tree={props.assetAccountsTree} indent={0} hidden={showHidden} accountEdit={onEditAccountClick}/>}
            {tabValue == 'income' && <CategorizedAccountList tree={props.incomeAccountsTree} indent={0} hidden={showHidden} accountEdit={onEditAccountClick}/>}
            {tabValue == 'expense' && <CategorizedAccountList tree={props.expenseAccountsTree} indent={0} hidden={showHidden} accountEdit={onEditAccountClick}/>}
        </Fragment>
    )
}

export default AccountsPage;
