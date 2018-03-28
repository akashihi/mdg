import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import Overview from './Overview';
import BudgetViewer from '../containers/BudgetViewer'
import AccountsViewer from '../containers/AccountsViewer'
import TransactionsViewer from '../containers/TransactionsViewer'
import SettingsViewer from '../containers/SettingsViewer'


export default class MainTabs extends Component {
    render() {
        return (<Tabs>
            <Tab label='Overview'>
                <Overview/>
            </Tab>
            <Tab label='Budget'>
                <BudgetViewer/>
            </Tab>
            <Tab label='Transactions'>
                <TransactionsViewer/>
            </Tab>
            <Tab label='Accounts'>
                <AccountsViewer/>
            </Tab>
            <Tab label='Settings'>
              <SettingsViewer/>
            </Tab>
        </Tabs>)
    }
}
