import * as Model from './model';
import { Ok, Err, Result } from 'ts-results';

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

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function settingListConvert(json: any): Result<Model.Setting[], Model.Problem> {
    if (!("settings" in json)) {
        // No root array, return error
    }
    if (!Array.isArray(json["settings"])) {
        // Root entry is not an array, return error
    }
    for (const r of json["settings"]) {
        if (!("id" in r) || !("value" in r)) {
            // Missing fields
        }
    }
    return new Ok(json["settings"] as Model.Setting[]);
}
export async function listSettings(): Promise<Result<Model.Setting[], Model.Problem>> {
    const response = await fetch('/api/settings');
    return parseResponse(response, settingListConvert)
}
