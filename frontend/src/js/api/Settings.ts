import {Err, Ok, Result} from "ts-results";
import * as Model from "./model";
import * as Errors from "./errors";
import {parseResponse, updateRequestParameters} from "./base";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"

const ajv = new Ajv()
const settingSchema: JTDSchemaType<Model.Setting> = {
    properties: {
        id: {enum: ["currency.primary", "ui.transaction.closedialog", "ui.language", "mnt.transaction.reindex"]},
        value: {type: "string"}
    }
}
const settingListSchema: JTDSchemaType<{ settings: Model.Setting[] }> = {
    properties: {
        settings: {elements: settingSchema}
    }
}

const settingParse = ajv.compileParser<Model.Setting>(settingSchema)
const settingListParse = ajv.compileParser<Record<string,Model.Setting[]>>(settingListSchema)

function settingListConvert(json: string): Result<Model.Setting[], Model.Problem> {
    const data = settingListParse(json);
    if (data === undefined) {
        return new Err(Errors.InvalidObject(settingParse.message as string));
    } else {
        return new Ok(data["settings"]);
    }
}

function settingConvert(json: string): Result<Model.Setting, Model.Problem> {
    const data = settingParse(json);
    if (data === undefined) {
        return new Err(Errors.InvalidObject(settingParse.message as string));
    } else {
        return new Ok(data);
    }
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
