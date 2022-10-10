import { Result } from 'ts-results';
import * as Model from './model';
import { parseListResponse, parseResponse, updateRequestParameters } from './base';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';

const ajv = new Ajv();
const settingSchema: JTDSchemaType<Model.Setting> = {
    properties: {
        id: { enum: ['currency.primary', 'ui.transaction.closedialog', 'ui.language', 'mnt.transaction.reindex'] },
        value: { type: 'string' },
    },
};
const settingListSchema: JTDSchemaType<{ settings: Model.Setting[] }> = {
    properties: {
        settings: { elements: settingSchema },
    },
};

const settingParse = ajv.compileParser<Model.Setting>(settingSchema);
const settingListParse = ajv.compileParser<Record<string, Model.Setting[]>>(settingListSchema);

export async function listSettings(): Promise<Result<Model.Setting[], Model.Problem>> {
    const response = await fetch('/api/settings');
    return parseListResponse(response, settingListParse, 'settings');
}

export async function saveSetting(setting: Model.Setting): Promise<Result<Model.Setting, Model.Problem>> {
    const url = `/api/settings/${setting.id}`;
    const response = await fetch(url, updateRequestParameters('PUT', setting));
    return parseResponse(response, settingParse);
}
