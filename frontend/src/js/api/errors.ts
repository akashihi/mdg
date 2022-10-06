import {Problem} from "./models/Problem";

const API_INVALID_OBJECT = 615;
const API_ROOT_ARRAY_MISSING = 617;
const API_ROOT_ARRAY_INCORRECT = 622;

export function InvalidObject(title: string): Problem {
    return {status: API_INVALID_OBJECT, code: "API_INVALID_OBJECT", title: title}
}

export function RootMissing(title: string): Problem {
    return {status: API_ROOT_ARRAY_MISSING, code: "API_ROOT_ARRAY_MISSING", title: title}
}

export function RootIncorrect(title: string): Problem {
    return {status: API_ROOT_ARRAY_INCORRECT, code: "API_ROOT_ARRAY_INCORRECT", title: title}
}

