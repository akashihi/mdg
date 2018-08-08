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
        json.errors.forEach((/*e*/)=>{

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
