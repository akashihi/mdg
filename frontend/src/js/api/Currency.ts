import {Err, Ok, Result} from "ts-results";
import * as Model from "./model";
import * as Errors from "./errors";
import {parseResponse, updateRequestParameters} from "./base";
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

function currencyistConvert(json: string): Result<Model.Currency[], Model.Problem> {
    const data = currencyListParse(json);
    if (data === undefined) {
        return new Err(Errors.InvalidObject(currencyParse.message as string));
    } else {
        return new Ok(data["currencies"]);
    }
}

function currencyConvert(json: string): Result<Model.Currency, Model.Problem> {
    const data = currencyParse(json);
    if (data === undefined) {
        return new Err(Errors.InvalidObject(currencyParse.message as string));
    } else {
        return new Ok(data);
    }
}

export async function listCurrencies(): Promise<Result<Model.Currency[], Model.Problem>> {
    const response = await fetch('/api/currencies');
    return parseResponse(response, currencyistConvert)
}

export async function saveCurrency(currency: Model.Currency): Promise<Result<Model.Currency, Model.Problem>> {
    const url = `/api/currencies/${currency.id}`;
    const response = await fetch(url, updateRequestParameters('PUT', currency));
    return await parseResponse(response, currencyConvert);
}
