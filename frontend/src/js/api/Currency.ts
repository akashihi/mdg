import {Result} from "ts-results";
import * as Model from "./model";
import {parseListResponse, parseResponse, updateRequestParameters} from "./base";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"

const ajv = new Ajv()
const currencySchema: JTDSchemaType<Model.Currency> = {
    properties: {
        id: {type: "uint32"},
        code: {type: "string"},
        name: {type: "string"},
        active: {type: "boolean"},
    },
}
const currencyListSchema: JTDSchemaType<{ currencies: Model.Currency[] }> = {
    properties: {
        currencies: {elements: currencySchema}
    }
}

const currencyParse = ajv.compileParser<Model.Currency>(currencySchema)
const currencyListParse = ajv.compileParser<Record<string,Model.Currency[]>>(currencyListSchema)

export async function listCurrencies(): Promise<Result<Model.Currency[], Model.Problem>> {
    const response = await fetch('/api/currencies');
    return parseListResponse(response, currencyListParse, "currencies");
}

export async function saveCurrency(currency: Model.Currency): Promise<Result<Model.Currency, Model.Problem>> {
    const url = `/api/currencies/${currency.id}`;
    const response = await fetch(url, updateRequestParameters('PUT', currency));
    return parseResponse(response, currencyParse);
}
