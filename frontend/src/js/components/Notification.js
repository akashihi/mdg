import React, { Component } from 'react'
import ReactMaterialUiNotifications from 'react-materialui-notifications'

export default class Notification extends Component {
    render() {
        return (<ReactMaterialUiNotifications
            desktop={true}
            transitionName={{
                leave: 'dummy',
                leaveActive: 'fadeOut',
                appear: 'dummy',
                appearActive: 'zoomInUp'
            }}
            transitionAppear={true}
            transitionLeave={true}
        />)
    }
}
