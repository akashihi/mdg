import { Result, Option, Some, None } from 'ts-results';
import * as Model from './model';
import {parseError, parseListResponse, parsePageableResponse, parseResponse, updateRequestParameters} from './base';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { categoryDefinition } from './Categories';
import { currencyDefinition } from './Currency';
import { accountDefinition } from './Accounts';

const ajv = new Ajv();

const budgetPairDefinition = {
    properties: {
        actual: { type: 'float32' },
        expected: { type: 'float32' },
    },
};

const budgetStateDefinition = {
    properties: {
        income: { ref: 'budgetPair' },
        expense: { ref: 'budgetPair' },
        allowed: { ref: 'budgetPair' },
    },
};

const budgetDefinition = {
    properties: {
        id: { type: 'uint32' },
        term_beginning: { type: 'string' },
        term_end: { type: 'string' },
        state: { ref: 'budgetState' },
        incoming_amount: { type: 'float32' },
        outgoing_amount: { ref: 'budgetPair' },
    },
};

const budgetEntryDefinition = {
    properties: {
        id: { type: 'uint32' },
        account_id: { type: 'uint32' },
        distribution: { enum: ['SINGLE', 'EVEN', 'PRORATED'] },
        expected_amount: { type: 'float32' },
        actual_amount: { type: 'float32' },
        allowed_spendings: { type: 'float32' },
        spending_percent: { type: 'float32' },
    },
    optionalProperties: {
        account: { ref: 'account' },
        category_id: { type: 'uint32' },
        category: { ref: 'category' },
    },
};

const budgetEntryTreeNodeDefinition = {
    properties: {
        expected_amount: { type: 'float32' },
        actual_amount: { type: 'float32' },
        allowed_spendings: { type: 'float32' },
        spending_percent: { type: 'float32' },
        entries: { elements: { ref: 'budgetEntry' } },
        categories: { elements: { ref: 'budgetEntryTreeNode' } },
    },
    optionalProperties: {
        id: { type: 'uint32' },
        name: { type: 'string' },
    },
};

const shortBudgetDefinition = {
    properties: {
        id: { type: 'uint32' },
        term_beginning: { type: 'string' },
        term_end: { type: 'string' },
    },
};

const budgetSchema: JTDSchemaType<
    Model.Budget,
    {
        category: Model.Category;
        currency: Model.Currency;
        account: Model.Account;
        budgetPair: Model.BudgetPair;
        budgetState: Model.BudgetState;
        budget: Model.Budget;
    }
> = {
    definitions: {
        category: categoryDefinition as JTDSchemaType<
            Model.Category,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetPair: Model.BudgetPair;
                budgetState: Model.BudgetState;
                budget: Model.Budget;
            }
        >,
        currency: currencyDefinition as JTDSchemaType<
            Model.Currency,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetPair: Model.BudgetPair;
                budgetState: Model.BudgetState;
                budget: Model.Budget;
            }
        >,
        account: accountDefinition as JTDSchemaType<
            Model.Account,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetPair: Model.BudgetPair;
                budgetState: Model.BudgetState;
                budget: Model.Budget;
            }
        >,
        budgetPair: budgetPairDefinition as JTDSchemaType<
            Model.BudgetPair,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetPair: Model.BudgetPair;
                budgetState: Model.BudgetState;
                budget: Model.Budget;
            }
        >,
        budgetState: budgetStateDefinition as JTDSchemaType<
            Model.BudgetState,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetPair: Model.BudgetPair;
                budgetState: Model.BudgetState;
                budget: Model.Budget;
            }
        >,
        budget: budgetDefinition as JTDSchemaType<
            Model.Budget,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetPair: Model.BudgetPair;
                budgetState: Model.BudgetState;
                budget: Model.Budget;
            }
        >,
    },
    ref: 'budget',
};

const budgetEntrySchema: JTDSchemaType<
    Model.BudgetEntry,
    { category: Model.Category; currency: Model.Currency; account: Model.Account; budgetEntry: Model.BudgetEntry }
> = {
    definitions: {
        category: categoryDefinition as JTDSchemaType<
            Model.Category,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetEntry: Model.BudgetEntry;
            }
        >,
        currency: currencyDefinition as JTDSchemaType<
            Model.Currency,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetEntry: Model.BudgetEntry;
            }
        >,
        account: accountDefinition as JTDSchemaType<
            Model.Account,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetEntry: Model.BudgetEntry;
            }
        >,
        budgetEntry: budgetEntryDefinition as JTDSchemaType<
            Model.BudgetEntry,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetEntry: Model.BudgetEntry;
            }
        >,
    },
    ref: 'budgetEntry',
};

const shortBudgetSchema: JTDSchemaType<Model.ShortBudget, {budget: Model.ShortBudget}> = {
    definitions: {
        budget: shortBudgetDefinition as JTDSchemaType<Model.ShortBudget, {budget: Model.ShortBudget}>
    },
    ref: "budget"
};

const shortBudgetListSchema: JTDSchemaType<Model.BudgetList, {budget: Model.ShortBudget}> = {
    definitions: {
        budget: shortBudgetDefinition as JTDSchemaType<Model.ShortBudget, {budget: Model.ShortBudget}>
    },
    properties: {
        budgets: { elements: { ref: "budget"} },
        self: { type: 'string' },
        first: { type: 'string' },
        next: { type: 'string' },
        left: { type: 'uint32' },
    },
};

const budgetEntryTreeSchema: JTDSchemaType<
    Model.BudgetEntryTree,
    {
        category: Model.Category;
        currency: Model.Currency;
        account: Model.Account;
        budgetEntry: Model.BudgetEntry;
        budgetEntryTreeNode: Model.BudgetEntryTreeNode;
    }
> = {
    definitions: {
        category: categoryDefinition as JTDSchemaType<
            Model.Category,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetEntry: Model.BudgetEntry;
                budgetEntryTreeNode: Model.BudgetEntryTreeNode;
            }
        >,
        currency: currencyDefinition as JTDSchemaType<
            Model.Currency,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetEntry: Model.BudgetEntry;
                budgetEntryTreeNode: Model.BudgetEntryTreeNode;
            }
        >,
        account: accountDefinition as JTDSchemaType<
            Model.Account,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetEntry: Model.BudgetEntry;
                budgetEntryTreeNode: Model.BudgetEntryTreeNode;
            }
        >,
        budgetEntry: budgetEntryDefinition as JTDSchemaType<
            Model.BudgetEntry,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetEntry: Model.BudgetEntry;
                budgetEntryTreeNode: Model.BudgetEntryTreeNode;
            }
        >,
        budgetEntryTreeNode: budgetEntryTreeNodeDefinition as JTDSchemaType<
            Model.BudgetEntryTreeNode,
            {
                category: Model.Category;
                currency: Model.Currency;
                account: Model.Account;
                budgetEntry: Model.BudgetEntry;
                budgetEntryTreeNode: Model.BudgetEntryTreeNode;
            }
        >,
    },
    properties: {
        income: { ref: 'budgetEntryTreeNode' },
        expense: { ref: 'budgetEntryTreeNode' },
    },
};

const budgetParse = ajv.compileParser<Model.Budget>(budgetSchema);
const budgetEntryParse = ajv.compileParser<Model.BudgetEntry>(budgetEntrySchema);
const shortBudgetParse = ajv.compileParser<Model.Budget>(shortBudgetSchema);
const shortBudgetListParse = ajv.compileParser<Model.BudgetList>(shortBudgetListSchema);
const budgetEntryTreeParse = ajv.compileParser<Model.BudgetEntryTree>(budgetEntryTreeSchema);

export async function listBudgets(): Promise<Result<Model.BudgetList, Model.Problem>> {
    const response = await fetch('/api/budgets');
    return parsePageableResponse(response, shortBudgetListParse);
}

export async function loadBudget(id: number): Promise<Result<Model.Budget, Model.Problem>> {
    const url = `/api/budgets/${id}`;
    const response = await fetch(url);
    return parseResponse(response, budgetParse);
}

export async function saveBudget(budget: Model.ShortBudget): Promise<Result<Model.ShortBudget, Model.Problem>> {
    let url = '/api/budgets';
    let method = 'POST';
    if (budget.id !== undefined && budget.id >= 0) {
        url = `/api/budgets/${budget.id}`;
        method = 'PUT';
    }

    const response = await fetch(url, updateRequestParameters(method, budget));
    return parseResponse(response, shortBudgetParse);
}

export async function saveBudgetEntry(
    entry: Model.BudgetEntry,
    budget_id: number
): Promise<Result<Model.BudgetEntry, Model.Problem>> {
    const url = `/api/budgets/${budget_id}/entries/${entry.id}`;
    const response = await fetch(url, updateRequestParameters('PUT', entry));

    return parseResponse(response, budgetEntryParse);
}

export async function deleteBudget(id: number): Promise<Option<Model.Problem>> {
    const url = `/api/budgets/${id}`;
    const method = 'DELETE';
    const response = await fetch(url, updateRequestParameters(method));
    if (response.status < 400) {
        const responseJson = await response.text();
        return new Some(parseError(response, responseJson));
    }
    return None;
}

export async function loadBudgetEntries(
    budget_id: number,
    filter: string
): Promise<Result<Model.BudgetEntryTree, Model.Problem>> {
    const url = `/api/budgets/${budget_id}/entries/tree?embed=category,account,currency&filter=${filter}`;
    const response = await fetch(url);
    return parseResponse(response, budgetEntryTreeParse);
}
