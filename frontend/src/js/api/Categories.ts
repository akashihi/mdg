import {Result, Option, Some, None} from "ts-results";
import * as Model from "./model";
import {parseError, parseListResponse, parseResponse, updateRequestParameters} from "./base";
import {produce} from "immer";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"

const ajv = new Ajv()
const categorySchema: JTDSchemaType<Model.Category, {category: Model.Category}> = {
    definitions: {
        category: {
            properties: {
                name: {type: "string"},
                priority: {type: "int16"},
                account_type: {enum: ["ASSET", "EXPENSE", "INCOME"]},
            },
            optionalProperties: {
                id: {type: "uint32"},
                parent_id: {type: "uint32"},
                children: {elements: {ref: "category"}}
            }
        }
    },
    ref: "category"
}

const categoryListSchema: JTDSchemaType<{ categories: Model.Category[]}, {category: Model.Category}> = {
    definitions: {
        category: {
            properties: {
                name: {type: "string"},
                priority: {type: "int16"},
                account_type: {enum: ["ASSET", "EXPENSE", "INCOME"]},
            },
            optionalProperties: {
                id: {type: "uint32"},
                parent_id: {type: "uint32"},
                children: {elements: {ref: "category"}}
            }
        }
    },
    properties: {
        categories: {elements: {ref: "category"}}
    }
}

const categoryParse = ajv.compileParser<Model.Category>(categorySchema)
const categoryListParse = ajv.compileParser<Record<string,Model.Category[]>>(categoryListSchema)

export async function listCategories(): Promise<Result<Model.Category[], Model.Problem>> {
    const response = await fetch('/api/categories');
    return parseListResponse(response, categoryListParse, "categories");
}

export async function saveCategory(category: Model.Category): Promise<Result<Model.Category, Model.Problem>> {
    let url = '/api/categories';
    let method = 'POST';
    if (category.id !== undefined) {
        url = `/api/categories/${category.id}`;
        method = 'PUT';
    }

    const updatedCategory: Model.Category = produce(draft => {
        if (category.parent_id === -1) {
            draft.parent_id = null;
        }
    })(category);
    const response = await fetch(url, updateRequestParameters(method, updatedCategory));
    return parseResponse(response, categoryParse);
}

export async function deleteCategory(id: number): Promise<Option<Model.Problem>> {
    const url = `/api/categories/${id}`;
    const method = 'DELETE';
    const response = await fetch(url, updateRequestParameters(method));
    if (response.status<400) {
        const responseJson = await response.text();
        return new Some(parseError(response, responseJson))
    }
    return None;
}
