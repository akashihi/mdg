import React from 'react'
import ReactMaterialUiNotifications from 'react-materialui-notifications'
import Message from 'material-ui/svg-icons/communication/message'

export function parseJSON(response) {
    return response.json()
}

export function checkApiError(json) {
    if (json.hasOwnProperty('errors')) {
        json.errors.forEach((e)=>{
            ReactMaterialUiNotifications.showNotification({
                title: e.title,
                additionalText: e.detail,
                icon: <Message />,
                overflowText: e.code,
                autoHide: 0
            });
        });
        throw new Error(json.errors[0].code)
    } else {
        return json
    }
}

export function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}
