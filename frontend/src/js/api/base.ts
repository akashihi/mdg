import * as Model from "./model";
import {Err, Ok, Result} from "ts-results";
import Ajv, {JTDParser, JTDSchemaType} from "ajv/dist/jtd"
import * as Errors from "./errors";

const ajv = new Ajv()
const problemSchema: JTDSchemaType<Model.Problem> = {
    properties: {
        status: {type: "int16"},
        code: {type: "string"},
        title: {type: "string"},
    },
    optionalProperties: {
        instance: {type: "string"},
        detail: {type: "string"},
    }
}
const problemParse = ajv.compileParser<Model.Problem>(problemSchema)


export function parseError(response: Response, messageJson: string): Model.Problem {
    const data = problemParse(messageJson);
    if (data === undefined) {
        return {status: response.status, code: "BACKEND_ERROR", title: "Non-documented backend error has occurred"};
    } else {
        return data;
    }
}

export async function parseListResponse<T>(response: Response, parser: JTDParser<Record<string, T[]>>, root: string): Promise<Result<T[], Model.Problem>> {
    const responseJson = await response.text();
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        const data = parser(responseJson);
        if (data === undefined) {
            return new Err(Errors.InvalidObject(parser.message as string));
        } else {
            return new Ok(data[root]);
        }
    }
}

export async function parseResponse<T>(response: Response, parser: JTDParser<T>): Promise<Result<T, Model.Problem>> {
    const responseJson = await response.text();
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        const data = parser(responseJson);
        if (data === undefined) {
            return new Err(Errors.InvalidObject(parser.message as string));
        } else {
            return new Ok(data);
        }
    }
}

export function updateRequestParameters<T>(method: string, data?: T): RequestInit {
    let parameters = {
        method,
        headers: {
            'Content-Type': 'application/vnd.mdg+json;version=1',
        },
    };
    if (data !== undefined) {
        parameters["body"] = JSON.stringify(data);
    }
    return parameters;
}
