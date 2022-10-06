import * as Model from "./model";
import {Err, Result} from "ts-results";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"

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


function parseError(response: Response, messageJson: string): Model.Problem {
    const data = problemParse(messageJson);
    if (data === undefined) {
        return {status: response.status, code: "BACKEND_ERROR", title: "Non-documented backend error has occurred"};
    } else {
        return data;
    }
}

export async function parseResponse<T>(response: Response, convertor: (json:string) => Result<T, Model.Problem>): Promise<Result<T, Model.Problem>> {
    const responseJson = await response.text();
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        return convertor(responseJson);
    }
}

export function updateRequestParameters<T>(method: string, data: T): RequestInit {
    return {
        method,
        headers: {
            'Content-Type': 'application/vnd.mdg+json;version=1',
        },
        body: JSON.stringify(data),
    }
}
