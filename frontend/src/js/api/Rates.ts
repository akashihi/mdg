import {Err, Ok, Result} from "ts-results";
import * as Model from "./model";
import * as Errors from "./errors";
import {parseResponse} from "./base";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"
import moment from 'moment';
import addFormats from "ajv-formats"

const ajv = new Ajv()
addFormats(ajv)
const rateSchema: JTDSchemaType<Model.Rate> = {
    properties: {
        id: {type: "uint32"},
        from: {type: "int16"},
        to: {type: "int16"},
        rate: {type: "float64"},
        beginning: {type: "timestamp"},
        end: {type: "timestamp"},
    },
    optionalProperties: {
        currencyCode: {type: "string"}
    }
}
const rateListSchema: JTDSchemaType<{ rates: Model.Rate[] }> = {
    properties: {
        rates: {elements: rateSchema}
    }
}

const rateListParse = ajv.compileParser<Record<string,Model.Rate[]>>(rateListSchema)

function rateListConvert(json: string): Result<Model.Rate[], Model.Problem> {
    const data = rateListParse(json);
    if (data === undefined) {
        return new Err(Errors.InvalidObject(rateListParse.message as string));
    } else {
        return new Ok(data["rates"]);
    }
}

export async function listRates(when: moment.Moment): Promise<Result<Model.Rate[], Model.Problem>> {
    const ts = when.format('YYYY-MM-DDTHH:mm:ss')
    const response = await fetch(`/api/rates/${ts}`);
    return parseResponse(response, rateListConvert)
}
