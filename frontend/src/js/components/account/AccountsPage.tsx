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


function AccountsPage(props: AccountsPageProps) {
    const [showHidden, setShowHidden] = useState(false);
    const [tabValue, setTabValue] = useState('asset');

    /*

    const onCreateAccountClick = () => {
        props.actions.createAccount();
    };

    let accounts;
    if (props.waiting) {
        accounts = <ClipLoader sizeUnit={'px'} size={150} loading={true}/>;
    } else if (props.error) {
        accounts = <h1>Unable to load account list</h1>;
    } else {

    */

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
            {/*<AccountEditor/>*/}
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
                        <Grid item lg={6} className='hide-on-small hide-on-medium'/>
                        <Grid item xs={12} sm={12} md={6} lg={3} className='hide-on-small'>
                            {hiddenButton}
                        </Grid>
                        {/*<Grid item xs={12} sm={12} md={6} lg={3}>
                            <Button aria-label='Add account' color='secondary' onClick={onCreateAccountClick}>Add
                                account</Button>
                        </Grid>*/}
                    </Grid>
                </CardContent>
            </Card>
            <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)} centered scrollButtons='auto'>
                <Tab label='Asset accounts' value='asset'/>
                <Tab label='Income accounts' value='income'/>
                <Tab label='Expense accounts' value='expense'/>
            </Tabs>
            {tabValue == 'asset' && <CategorizedAccountList tree={props.assetAccountsTree} indent={0} hidden={showHidden}/>}
            {tabValue == 'income' && <CategorizedAccountList tree={props.incomeAccountsTree} indent={0} hidden={showHidden}/>}
            {tabValue == 'expense' && <CategorizedAccountList tree={props.expenseAccountsTree} indent={0} hidden={showHidden}/>}
        </Fragment>
    )
}

export default AccountsPage;
