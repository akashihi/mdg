import React, { Component } from 'react';

import MainTabs from './MainTabs'
import Notification from './Notification'


export default class Main extends Component {
    render() {
        return (<div>
            <MainTabs/>
            <Notification/>
        </div>)
    }
}
