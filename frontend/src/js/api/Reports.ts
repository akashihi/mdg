import {Result, Option, Some, None} from "ts-results";
import * as Model from "./model";
import {parseError, parseListResponse, parseResponse, updateRequestParameters} from "./base";
import Ajv, {JTDSchemaType} from "ajv/dist/jtd"
import {categoryDefinition} from "./Categories";
import {currencyDefinition} from "./Currency";

const ajv = new Ajv()

const reportAmountDefinition = {
    properties: {
        amount: {type: "float32"},
    },
    optionalProperties: {
        name: {type: "string"},
        data: {type: "timestamp"}
    }
}

const totalsReportDefinition = {
    properties: {
        category_name: {type: "string"},
        primary_balance: {type: "float32"},
        amounts: {elements: {ref: "amount"}}
    },
}
const totalsReportSchema: JTDSchemaType<{report: Model.TotalsReport[]}, {amount: Model.ReportAmount, report: Model.TotalsReport}> = {
    definitions: {
        amount: reportAmountDefinition as JTDSchemaType<Model.ReportAmount, {amount: Model.ReportAmount, report: Model.TotalsReport}>,
        report: totalsReportDefinition as JTDSchemaType<Model.TotalsReport, {amount: Model.ReportAmount, report: Model.TotalsReport}>,
    },
    properties: {
        report: {elements: {ref: "report"}}
    }
}

const totalsReportParse = ajv.compileParser<Record<string,Model.TotalsReport[]>>(totalsReportSchema);

export async function loadTotalsReport(): Promise<Result<Model.TotalsReport[], Model.Problem>> {
    const response = await fetch('/api/reports/totals');
    return parseListResponse(response, totalsReportParse, "report");
}

