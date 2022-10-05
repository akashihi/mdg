import * as Model from './model';
import { Ok, Err, Result } from 'ts-results';

const API_FIELD_MISSING = 615;
const API_ROOT_ARRAY_MISSING = 617;
const API_ROOT_ARRAY_INCORRECT = 622;

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function parseError(response: Response, messageJson: any): Model.Problem {
    if ("status" in messageJson && "code" in messageJson && "title") {
        return new messageJson as Model.Problem;
    }
    return {status: response.status, code: "BACKEND_ERROR", title: "Non-documented backend error has occurred"}
}

async function parseResponse<T>(response: Response, convertor: (any) => Result<T, Model.Problem>): Promise<Result<T, Model.Problem>> {
    const responseJson = await response.json();
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        return convertor(responseJson);
    }
}

function updateRequestParameters<T>(method: string, data: T): RequestInit {
    return {
        method,
        headers: {
            'Content-Type': 'application/vnd.mdg+json;version=1',
        },
        body: JSON.stringify(data),
    }
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function settingListConvert(json: any): Result<Model.Setting[], Model.Problem> {
    if (!("settings" in json)) {
        return new Err({status: API_ROOT_ARRAY_MISSING, code: "API_ROOT_ARRAY_MISSING", title: "Settings list's root array is missing"})
    }
    if (!Array.isArray(json["settings"])) {
        return new Err({status: API_ROOT_ARRAY_INCORRECT, code: "API_ROOT_ARRAY_INCORRECT", title: "Settings list's root array is broken"})
    }
    for (const r of json["settings"]) {
        if (!("id" in r) || !("value" in r)) {
            return new Err({status: API_FIELD_MISSING, code: "API_FIELD_MISSING", title: "Setting object is missing a field"})
        }
    }
    return new Ok(json["settings"] as Model.Setting[]);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function settingConvert(json: any): Result<Model.Setting, Model.Problem> {
    if (!("id" in json) || !("value" in json)) {
        return new Err({status: API_FIELD_MISSING, code: "API_FIELD_MISSING", title: "Setting object is missing a field"})
    }
    return new Ok(json as Model.Setting);
}

export async function listSettings(): Promise<Result<Model.Setting[], Model.Problem>> {
    const response = await fetch('/api/settings');
    return parseResponse(response, settingListConvert)
}

export async function saveSetting(setting: Model.Setting): Promise<Result<Model.Setting, Model.Problem>> {
    const url = `/api/settings/${setting.id}`;
    const response = await fetch(url, updateRequestParameters('PUT', setting));
    return await parseResponse(response, settingConvert);
}
