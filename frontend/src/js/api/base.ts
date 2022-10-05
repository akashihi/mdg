import * as Model from "./model";
import {Err, Result} from "ts-results";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
function parseError(response: Response, messageJson: any): Model.Problem {
    if ("status" in messageJson && "code" in messageJson && "title") {
        return new messageJson as Model.Problem;
    }
    return {status: response.status, code: "BACKEND_ERROR", title: "Non-documented backend error has occurred"}
}

export async function parseResponse<T>(response: Response, convertor: (any) => Result<T, Model.Problem>): Promise<Result<T, Model.Problem>> {
    const responseJson = await response.json();
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
