import {Result, Option, Some, None} from "ts-results";
import * as Model from "./model";
import {parseError, parseListResponse, parseResponse, updateRequestParameters} from "./base";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"
import {categoryDefinition} from "./Categories";
import {currencyDefinition} from "./Currency";

const ajv = new Ajv()
const accountStatusSchema: JTDSchemaType<Model.AccountStatus> = {
    properties: {
        id: {type: "uint32"},
        deletable: {type: "boolean"}
    }
}
const accountDefinition = {
    properties: {
        id: {type: "uint32"},
        account_type: {enum: ["ASSET", "EXPENSE", "INCOME"]},
        currency_id: {type: "uint32"},
        name: {type: "string"},
        balance: {type: "float32"},
        primary_balance: {type: "float32"},
        operational: {type: "boolean"},
        favorite: {type: "boolean"}
    },
    optionalProperties: {
        hidden: {type: "boolean"},
        category_id: {type: "uint32"},
        currency: {ref: "currency"},
        category: {ref: "category"}
    }
}

const accountSchema: JTDSchemaType<Model.Account, {category: Model.Category, currency: Model.Currency, account: Model.Account}> = {
    definitions: {
        category: categoryDefinition as JTDSchemaType<Model.Category, {category: Model.Category, currency: Model.Currency, account: Model.Account}>,
        currency: currencyDefinition as JTDSchemaType<Model.Currency, {category: Model.Category, currency: Model.Currency, account: Model.Account}>,
        account: accountDefinition as JTDSchemaType<Model.Account, {category: Model.Category, currency: Model.Currency, account: Model.Account}>
    },
    ref: "account"
}
const accountListSchema: JTDSchemaType<{ accounts: Model.Account[]}, {category: Model.Category, currency: Model.Currency, account: Model.Account}> = {
    definitions: {
        category: categoryDefinition as JTDSchemaType<Model.Category, {category: Model.Category, currency: Model.Currency, account: Model.Account}>,
        currency: currencyDefinition as JTDSchemaType<Model.Currency, {category: Model.Category, currency: Model.Currency, account: Model.Account}>,
        account: accountDefinition as JTDSchemaType<Model.Account, {category: Model.Category, currency: Model.Currency, account: Model.Account}>
    },
    properties: {
        accounts: {elements: {ref: "account"}}
    }
}

const accountParse = ajv.compileParser<Model.Account>(accountSchema);
const accountListParse = ajv.compileParser<Record<string,Model.Account[]>>(accountListSchema);
const accountStatusParse = ajv.compileParser<Model.AccountStatus>(accountStatusSchema);

export async function listAccounts(): Promise<Result<Model.Account[], Model.Problem>> {
    const response = await fetch('/api/accounts?embed=currency');
    return parseListResponse(response, accountListParse, "accounts");
}

export async function getAccountStatus(account: Model.Account): Promise<Result<Model.AccountStatus, Model.Problem>> {
    const url = `/api/accounts/${account.id}/status`;
    const response = await fetch(url);
    return parseResponse(response, accountStatusParse);
}

export async function saveAccount(account: Model.Account): Promise<Result<Model.Account, Model.Problem>> {
    let url = '/api/accounts';
    let method = 'POST';
    if (account.id !== undefined && account.id >= 0) {
        url = `/api/accounts/${account.id}`;
        method = 'PUT';
    }

    const response = await fetch(url, updateRequestParameters(method, account));
    return parseResponse(response, accountParse);
}

export async function deleteAccount(id: number): Promise<Option<Model.Problem>> {
    const url = `/api/accounts/${id}`;
    const method = 'DELETE';
    const response = await fetch(url, updateRequestParameters(method));
    if (response.status<400) {
        const responseJson = await response.text();
        return new Some(parseError(response, responseJson))
    }
    return None;
}
