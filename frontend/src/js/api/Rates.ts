import { Result } from 'ts-results';
import * as Model from './model';
import { parseListResponse } from './base';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import moment from 'moment';

const ajv = new Ajv();
const rateSchema: JTDSchemaType<Model.Rate> = {
    properties: {
        id: { type: 'uint32' },
        from: { type: 'int16' },
        to: { type: 'int16' },
        rate: { type: 'float64' },
        beginning: { type: 'timestamp' },
        end: { type: 'timestamp' },
    },
    optionalProperties: {
        currencyCode: { type: 'string' },
    },
};
const rateListSchema: JTDSchemaType<{ rates: Model.Rate[] }> = {
    properties: {
        rates: { elements: rateSchema },
    },
};

const rateListParse = ajv.compileParser<Record<string, Model.Rate[]>>(rateListSchema);

export async function listRates(when: moment.Moment): Promise<Result<Model.Rate[], Model.Problem>> {
    const ts = when.format('YYYY-MM-DDTHH:mm:ss');
    const response = await fetch(`/api/rates/${ts}`);
    return parseListResponse(response, rateListParse, 'rates');
}
