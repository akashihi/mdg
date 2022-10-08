import {Result, Option, Some, None, Err, Ok} from "ts-results";
import * as Model from "./model";
import {parseError, parseListResponse, parseResponse, updateRequestParameters} from "./base";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"
import {categoryDefinition} from "./Categories";
import {currencyDefinition} from "./Currency";
import {accountDefinition} from "./Accounts";
import {Moment} from "moment/moment";
import jQuery from "jquery";
import {TransactionList} from "./model";
import * as Errors from "./errors";

const ajv = new Ajv()
const operationDefinition = {
    properties: {
        account_id: {type: "uint32"},
        amount: {type: "float32"}
    },
    optionalProperties: {
        rate: {type: "float32"},
        account: {ref: "account"}
    }
}

const transactionDefinition = {
    properties: {
        id: {type: "uint32"},
        timestamp: {type: "string"},
        operations: {elements: {ref: "operation"}},
    },
    optionalProperties: {
        comment: {type: "string"},
        tags: {elements: {type: "string"}},
    }
}

const transactionSchema: JTDSchemaType<Model.Transaction, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}> = {
    definitions: {
        category: categoryDefinition as JTDSchemaType<Model.Category, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
        currency: currencyDefinition as JTDSchemaType<Model.Currency, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
        account: accountDefinition as JTDSchemaType<Model.Account, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
        operation: operationDefinition as JTDSchemaType<Model.Operation, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
        transaction: transactionDefinition as JTDSchemaType<Model.Transaction, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
    },
    ref: "transaction"
}
const transactionListSchema: JTDSchemaType<TransactionList, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}> = {
    definitions: {
        category: categoryDefinition as JTDSchemaType<Model.Category, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
        currency: currencyDefinition as JTDSchemaType<Model.Currency, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
        account: accountDefinition as JTDSchemaType<Model.Account, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
        operation: operationDefinition as JTDSchemaType<Model.Operation, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
        transaction: transactionDefinition as JTDSchemaType<Model.Transaction, {category: Model.Category, currency: Model.Currency, account: Model.Account, operation: Model.Operation, transaction: Model.Transaction}>,
    },
    properties: {
        transactions: {elements: {ref: "transaction"}},
        self: {type: "string"},
        first: {type: "string"},
        next: {type: "string"},
        left: {type: "uint32"}
    }
}

const transactionParse = ajv.compileParser<Model.Transaction>(transactionSchema);
const transactionListParse = ajv.compileParser<TransactionList>(transactionListSchema);

export interface TransactionFilterParams {
    readonly notEarlier: Moment;
    readonly notLater: Moment;
    readonly comment: string | undefined;
    readonly account_id: number[];
    readonly tag: string[];
}

async function fetchTransactions(queryParams: string): Promise<Result<TransactionList, Model.Problem>> {
    const url = '/api/transactions' + '?' + queryParams;
    const response = await fetch(url);
    const responseJson = await response.text();
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        const data = transactionListParse(responseJson);
        if (data === undefined) {
            return new Err(Errors.InvalidObject(transactionListParse.message as string));
        } else {
            return new Ok(data);
        }
    }

}

export async function listTransactions(filter: Partial<TransactionFilterParams>, limit: number): Promise<Result<TransactionList, Model.Problem>> {
    let stringNotEarlier: string|null = null;
    if (filter.notEarlier !== undefined) {
        stringNotEarlier = filter.notEarlier.format('YYYY-MM-DDT00:00:00');
    }
    let stringNotLater: string|null = null;
    if (filter.notLater !== undefined) {
        stringNotLater = filter.notLater.format('YYYY-MM-DDT23:59:59');
    }
    const stringifiedFilter = {...filter, notLater: stringNotLater, notEarlier: stringNotEarlier}
    const params = Object.assign({}, { q: JSON.stringify(stringifiedFilter) }, { limit: limit }, { embed: 'account' });
    const queryParams = jQuery.param(params);
    return fetchTransactions(queryParams);
}

export async function loadTransactions(cursor: string): Promise<Result<TransactionList, Model.Problem>> {
    const queryParams = jQuery.param({ cursor: cursor });
    return fetchTransactions(queryParams);
}

export async function saveTransaction(transaction: Model.Transaction): Promise<Result<Model.Transaction, Model.Problem>> {
    let url = '/api/transactions';
    let method = 'POST';
    if (transaction.id !== undefined && transaction.id >= 0) {
        url = `/api/transactions/${transaction.id}`;
        method = 'PUT';
    }

    const response = await fetch(url, updateRequestParameters(method, transaction));
    return parseResponse(response, transactionParse);
}

export async function deleteTransaction(id: number): Promise<Option<Model.Problem>> {
    const url = `/api/transactions/${id}`;
    const method = 'DELETE';
    const response = await fetch(url, updateRequestParameters(method));
    if (response.status<400) {
        const responseJson = await response.text();
        return new Some(parseError(response, responseJson))
    }
    return None;
}
