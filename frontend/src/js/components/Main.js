import React, { Component } from 'react'

import Grid from '@mui/material/Grid'
import { Switch, Route } from 'react-router-dom'

import TopBar from '../containers/TopBar'
import TransactionCreate from '../containers/TransactionCreate'
import Overview from './Overview'
import BudgetViewer from '../containers/BudgetViewer'
import AccountsViewer from '../containers/AccountsViewer'
import TransactionsViewer from '../containers/TransactionsViewer'
import SettingsViewer from '../containers/SettingsViewer'
import RateViewer from '../containers/RateViewer'
import TransactionEditor from '../containers/TransactionEditor';
import ReportsViewer from '../containers/ReportsViewer'

window.notifications = React.createRef()

export default class Main extends Component {
    render () {
        return (
            <div>
                <TopBar/>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={11} lg={11}>
                        <Switch>
                            <Route exact path="/">
                                <Overview/>
                            </Route>
                            <Route path="/budget">
                                <BudgetViewer/>
                            </Route>
                            <Route path="/transactions">
                                <TransactionsViewer/>
                            </Route>
                            <Route path="/reports">
                                <ReportsViewer/>
                            </Route>
                            <Route path="/accounts">
                                <AccountsViewer/>
                            </Route>
                            <Route path="/settings">
                                <SettingsViewer/>
                            </Route>
                        </Switch>
                    </Grid>
                    <Grid item xs={0} sm={0} md={1} lg={1} className="hide-on-medium">
                        <RateViewer/>
                    </Grid>
                </Grid>
                <TransactionCreate/>
                <TransactionEditor unmountOnExit/>
            </div>
        )
    }
}
