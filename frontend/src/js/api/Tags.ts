import {Result} from "ts-results";
import * as Model from "./model";
import {parseListResponse} from "./base";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"

const ajv = new Ajv()
const tagListSchema: JTDSchemaType<{ tags: string[]}> = {
    properties: {
        tags: {elements: {type: "string"}}
    }
}

const tagListParse = ajv.compileParser<Record<string,string[]>>(tagListSchema)

export async function listTags(): Promise<Result<string[], Model.Problem>> {
    const response = await fetch('/api/tags');
    return parseListResponse(response, tagListParse, "tags");
}
