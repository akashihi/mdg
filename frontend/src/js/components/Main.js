import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';

import Overview from './Overview';

export default class Main extends Component {
    render() {
        return (<Tabs>
            <Tab label="Состояние">
                <Overview/>
            </Tab>
            <Tab label="Бюджет">
                <p>Бюджет</p>
            </Tab>
            <Tab label="Операции">
                <p>Операции</p>
            </Tab>
        </Tabs>)
    }
}
