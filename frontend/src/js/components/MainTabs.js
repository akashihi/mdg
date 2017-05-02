import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import Overview from './Overview';
import BudgetViewer from '../containers/BudgetViewer'
import AccountsPage from '../components/AccountsPage'


export default class MainTabs extends Component {
    render() {
        return (<Tabs>
            <Tab label='Budget'>
                <BudgetViewer/>
            </Tab>
            <Tab label='Overview'>
                <Overview/>
            </Tab>
            <Tab label='Operations'>
                <p>Operations</p>
            </Tab>
            <Tab label='Accounts'>
                <AccountsPage/>
            </Tab>
        </Tabs>)
    }
}
