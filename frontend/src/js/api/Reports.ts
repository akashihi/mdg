import { Result, Err, Ok } from 'ts-results';
import * as Model from './model';
import { parseError, parseListResponse } from './base';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import moment, { Moment } from 'moment/moment';
import jQuery from 'jquery';
import * as Errors from './errors';
import {BudgetCashflowReport} from "./model";

export interface ReportParams {
    startDate: Moment;
    endDate: Moment;
    granularity: number;
    primaryCurrencyName: string;
}

const ajv = new Ajv();

const reportAmountDefinition = {
    properties: {
        amount: { type: 'float32' },
    },
    optionalProperties: {
        name: { type: 'string' },
        data: { type: 'timestamp' },
    },
};

const totalsReportDefinition = {
    properties: {
        category_name: { type: 'string' },
        primary_balance: { type: 'float32' },
        amounts: { elements: { ref: 'amount' } },
    },
};
const totalsReportSchema: JTDSchemaType<
    { report: Model.TotalsReport[] },
    { amount: Model.ReportAmount; report: Model.TotalsReport }
> = {
    definitions: {
        amount: reportAmountDefinition as JTDSchemaType<
            Model.ReportAmount,
            { amount: Model.ReportAmount; report: Model.TotalsReport }
        >,
        report: totalsReportDefinition as JTDSchemaType<
            Model.TotalsReport,
            { amount: Model.ReportAmount; report: Model.TotalsReport }
        >,
    },
    properties: {
        report: { elements: { ref: 'report' } },
    },
};

const totalsReportParse = ajv.compileParser<Record<string, Model.TotalsReport[]>>(totalsReportSchema);

function reportDatesToParams(dates: ReportParams): string {
    const params = {
        startDate: dates.startDate.format('YYYY-MM-DD'),
        endDate: dates.endDate.format('YYYY-MM-DD'),
        granularity: dates.granularity,
    };
    return '?' + jQuery.param(params);
}

export async function loadTotalsReport(): Promise<Result<Model.TotalsReport[], Model.Problem>> {
    const response = await fetch('/api/reports/totals');
    return parseListResponse(response, totalsReportParse, 'report');
}

export async function loadAssetReport(
    type: string,
    params: ReportParams
): Promise<Result<Model.Report, Model.Problem>> {
    const url = `/api/reports/${type}/${reportDatesToParams(params)}`;
    const response = await fetch(url);
    const responseJson = JSON.parse(await response.text());
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        try {
            const dates = responseJson.dates.map(item => moment(item).format("DD. MMM' YY"));
            return new Ok({ dates: dates, series: responseJson.series });
        } catch (e) {
            return new Err(Errors.InvalidObject(e as string));
        }
    }
}

export async function loadEventsReport(
    type: string,
    params: ReportParams
): Promise<Result<Model.PieData, Model.Problem>> {
    const url = `/api/reports/${type}/accounts/${reportDatesToParams(params)}`;
    const response = await fetch(url);
    const responseJson = JSON.parse(await response.text());
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        try {
            const dates = responseJson.dates.map(item => moment(item).format("DD. MMM' YY"));

            const data = responseJson.series.map(item => {
                return { name: item.name, y: item.data[0].y };
            });
            return new Ok({ dates: dates, data: data });
        } catch (e) {
            return new Err(Errors.InvalidObject(e as string));
        }
    }
}

export async function loadBudgetReport(
    params: ReportParams
): Promise<Result<Model.BudgetExecutionReport, Model.Problem>> {
    const url = `/api/reports/budget/execution/${reportDatesToParams(params)}`;
    const response = await fetch(url);
    const responseJson = JSON.parse(await response.text());
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        try {
            const dates = responseJson.dates.map(item => moment(item).format("DD. MMM' YY"));

            return new Ok({
                dates: dates,
                actual_income: responseJson.actual_income,
                actual_expense: responseJson.actual_expense,
                expected_income: responseJson.expected_income,
                expected_expense: responseJson.expected_expense,
                profit: responseJson.profit,
            });
        } catch (e) {
            return new Err(Errors.InvalidObject(e as string));
        }
    }
}

export async function loadBudgetCashflowReport(
    id: number
): Promise<Result<Model.BudgetCashflowReport, Model.Problem>> {
    const url = `/api/reports/budget/cashflow/${id}`;
    const response = await fetch(url);
    const responseJson = JSON.parse(await response.text());
    if (response.status >= 400) {
        return new Err(parseError(response, responseJson));
    } else {
        // Should be fine, try to convert
        try {
            const dates = responseJson.dates.map(item => moment(item).format("DD. MMM' YY"));

            return new Ok({
                dates: dates,
                actual: responseJson.actual,
                expected: responseJson.expected,
            });
        } catch (e) {
            return new Err(Errors.InvalidObject(e as string));
        }
    }
}
