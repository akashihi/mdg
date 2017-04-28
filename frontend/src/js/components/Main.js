import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import Overview from './Overview';
import BudgetViewer from '../containers/BudgetViewer'


export default class Main extends Component {
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
        </Tabs>)
    }
}