import {Problem} from "./models/Problem";

const API_FIELD_MISSING = 615;
const API_ROOT_ARRAY_MISSING = 617;
const API_ROOT_ARRAY_INCORRECT = 622;

export function FieldMissing(title: string): Problem {
    return {status: API_FIELD_MISSING, code: "API_FIELD_MISSING", title: title}
}

export function RootMissing(title: string): Problem {
    return {status: API_ROOT_ARRAY_MISSING, code: "API_ROOT_ARRAY_MISSING", title: title}
}

export function RootIncorrect(title: string): Problem {
    return {status: API_ROOT_ARRAY_INCORRECT, code: "API_ROOT_ARRAY_INCORRECT", title: title}
}

