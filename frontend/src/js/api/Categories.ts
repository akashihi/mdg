import {Err, Ok, Result, Option, Some, None} from "ts-results";
import * as Model from "./model";
import {parseError, updateRequestParameters} from "./base";
import * as Errors from "./errors";
import {produce} from "immer";

// As JTD doesn't seem to support recursion, no validation is provided
export async function listCategories(): Promise<Result<Model.Category[], Model.Problem>> {
    const response = await fetch('/api/categories');
    const responseJson = await response.text();
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        try {
            const data =JSON.parse(responseJson);
            return new Ok(data.categories as Model.Category[]);
        } catch(err) {
            return new Err(Errors.InvalidObject(err as string));
        }
    }
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
    const responseJson = await response.text();
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        try {
            const data =JSON.parse(responseJson);
            return new Ok(data as Model.Category);
        } catch(err) {
            return new Err(Errors.InvalidObject(err as string));
        }
    }
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
