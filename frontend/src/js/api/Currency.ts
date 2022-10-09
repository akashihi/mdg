import { Result } from 'ts-results';
import * as Model from './model';
import { parseListResponse, parseResponse, updateRequestParameters } from './base';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';

const ajv = new Ajv();
export const currencyDefinition = {
    properties: {
        id: { type: 'uint32' },
        code: { type: 'string' },
        name: { type: 'string' },
        active: { type: 'boolean' },
    },
};
const currencySchema: JTDSchemaType<Model.Currency, { currency: Model.Currency }> = {
    definitions: {
        currency: currencyDefinition as JTDSchemaType<Model.Currency, { currency: Model.Currency }>,
    },
    ref: 'currency',
};
const currencyListSchema: JTDSchemaType<{ currencies: Model.Currency[] }, { currency: Model.Currency }> = {
    definitions: {
        currency: currencyDefinition as JTDSchemaType<Model.Currency, { currency: Model.Currency }>,
    },
    properties: {
        currencies: { elements: { ref: 'currency' } },
    },
};

const currencyParse = ajv.compileParser<Model.Currency>(currencySchema);
const currencyListParse = ajv.compileParser<Record<string, Model.Currency[]>>(currencyListSchema);

export async function listCurrencies(): Promise<Result<Model.Currency[], Model.Problem>> {
    const response = await fetch('/api/currencies');
    return parseListResponse(response, currencyListParse, 'currencies');
}

export async function saveCurrency(currency: Model.Currency): Promise<Result<Model.Currency, Model.Problem>> {
    const url = `/api/currencies/${currency.id}`;
    const response = await fetch(url, updateRequestParameters('PUT', currency));
    return parseResponse(response, currencyParse);
}
