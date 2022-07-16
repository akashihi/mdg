import React  from 'react';

import Grid from '@mui/material/Grid';
import { Routes, Route } from 'react-router-dom';

import TopBar from '../containers/TopBar';
import TransactionCreate from '../containers/TransactionCreate';
import Overview from './Overview';
import BudgetViewer from '../containers/BudgetViewer';
import AccountsViewer from '../containers/AccountsViewer';
import TransactionsViewer from '../containers/TransactionsViewer';
import SettingsPage from './settings/SettingsPage';
import RateViewer from '../containers/RateViewer';
import TransactionEditor from '../containers/TransactionEditor';
import ReportsViewer from '../containers/ReportsViewer';

export function Main() {
    return <div>
        <TopBar />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={11} lg={11}>
            <Routes>
              <Route path='/' element={<Overview />} />
              <Route path='/budget' element={<BudgetViewer />} />
              <Route path='/transactions' element={<TransactionsViewer />} />
              <Route path='/reports' element={<ReportsViewer />} />
              <Route path='/accounts' element={<AccountsViewer />} />
              <Route path='/settings' element={<SettingsPage />} />
            </Routes>
          </Grid>
          <Grid item xs={0} sm={0} md={1} lg={1} className='hide-on-medium'>
            <RateViewer />
          </Grid>
        </Grid>
        <TransactionCreate />
        <TransactionEditor/>
      </div>
}

export default Main;
