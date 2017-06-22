import React from 'react'
import ReactMaterialUiNotifications from 'react-materialui-notifications'
import Message from 'material-ui/svg-icons/communication/message'

export function parseJSON(response) {
    try {
        return response.json()
    } catch (e) {
        //Not a json, pass
    }

}

export function checkApiError(json) {
    if (typeof json === 'undefined') {
        return json
    }
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

export function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}