import { OrderedMap, Map } from 'immutable';

export function parseJSON(response) {
    try {
        return response.json()
    } catch (e) {
        //Not a json, pass
    }

}

export function dataToMap(json) {
    return json.data.reduce((acc, item) => {
        return acc.set(item.id, Map(item.attributes))
    }, new OrderedMap())
}

export function mapToData(id, item) {
    return {
        data: {
            id: id,
            attributes: item.toJS()
        }
    }
}

export function checkApiError(json) {
    if (typeof json === 'undefined') {
        return json
    }
    if (json.hasOwnProperty('errors')) {
        json.errors.forEach((e)=>{
          window.notifications.addNotification(
            {
                  title: e.title + '(' + e.code + ')',
                  message: e.detail,
                  level: 'error',
                  position: 'bl',
                  autoDismiss: 10
            }
          )
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
