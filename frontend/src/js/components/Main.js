import React, { Component } from 'react';

import MainTabs from './MainTabs'
import Notification from './Notification'
import TransactionCreate from '../containers/TransactionCreate'

export default class Main extends Component {
    render() {
        return (<div>
            <MainTabs/>
            <TransactionCreate/>
            <Notification/>
        </div>)
    }
}
