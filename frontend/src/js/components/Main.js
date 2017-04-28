import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import Overview from './Overview';
import BudgetPage from './BudgetPage'


export default class Main extends Component {
    render() {
        return (<Tabs>
            <Tab label='Budget'>
                <BudgetPage/>
            </Tab>
            <Tab label='Overview'>
                <Overview/>
            </Tab>
            <Tab label='Operations'>
                <p>Operations</p>
            </Tab>
        </Tabs>)
    }
}
