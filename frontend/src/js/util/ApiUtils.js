export function parseJSON (response) {
  try {
    return response.json()
  } catch (e) {
    // Not a json, pass
  }
}

export function checkApiError (json) {
  if (typeof json === 'undefined') {
    return json
  }
  if (Object.prototype.hasOwnProperty.call(json, 'errors')) {
    json.errors.forEach((e) => {
      window.notifications.addNotification(
        {
          title: e.title + '(' + e.code + ')',
          message: e.detail,
          level: 'error',
          position: 'bl',
          autoDismiss: 10
        }
      )
    })
    throw new Error(json.errors[0].code)
  } else {
    return json
  }
}
