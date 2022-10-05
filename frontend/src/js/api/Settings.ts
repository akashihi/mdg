import {Err, Ok, Result} from "ts-results";
import * as Model from "./model";
import * as Errors from "./errors";
import {parseResponse, updateRequestParameters} from "./base";


/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function settingListConvert(json: any): Result<Model.Setting[], Model.Problem> {
    if (!("settings" in json)) {
        return new Err(Errors.RootMissing("Settings list's root array is missing"));
    }
    if (!Array.isArray(json["settings"])) {
        return new Err(Errors.RootIncorrect("Settings list's root array is broken"));
    }
    for (const r of json["settings"]) {
        if (!("id" in r) || !("value" in r)) {
            return new Err(Errors.FieldMissing("Setting object is missing a field"));
        }
    }
    return new Ok(json["settings"] as Model.Setting[]);
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function settingConvert(json: any): Result<Model.Setting, Model.Problem> {
    if (!("id" in json) || !("value" in json)) {
        return new Err(Errors.FieldMissing("Setting object is missing a field"));
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
