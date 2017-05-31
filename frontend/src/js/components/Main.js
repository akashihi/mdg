import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import MainTabs from './MainTabs'
import Notification from './Notification'

const floatingButtonStyle = {
    marginRight: 40,
    marginBottom: 40,
    position: 'fixed',
    right: 0,
    bottom: 0
};

export default class Main extends Component {
    render() {
        return (<div>
            <MainTabs/>
            <FloatingActionButton secondary={true} style={floatingButtonStyle}>
                <ContentAdd />
            </FloatingActionButton>
            <Notification/>
        </div>)
    }
}
