export function parseJSON (response: Response) {
  try {
    return response.json()
  } catch (e) {
    // Not a json, pass
  }
}

export function checkApiError (json) {
//Do nothing atm
    return json;
}
