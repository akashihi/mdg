import { Result, Err, Ok, Option, Some } from 'ts-results';
import * as Model from './model';
import { parseListResponse, parseResponse } from './base';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import moment, { Moment } from 'moment/moment';
import * as Errors from './errors';

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
        name: { type: 'string' },
    },
    optionalProperties: {
        date: { type: 'string' },
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

const evaluationReportSchema: JTDSchemaType<Model.EvaluationReport> = {
    properties: {
        income: { type: 'int32' },
        debt: { type: 'int32' },
        budget: { type: 'int32' },
        cash: { type: 'int32' },
        state: { type: 'int32' },
    },
};

const reportSeriesEntryDefinition = {
    properties: {
        y: { type: 'float32' },
        custom: { type: 'float32' },
    },
};

const reportSeriesDefinition = {
    properties: {
        name: { type: 'string' },
        data: { elements: { ref: 'entry' } },
        type: { enum: ['area', 'column', 'line'] },
    },
};

const seriesDefinitions = { entry: reportSeriesEntryDefinition, series: reportSeriesDefinition };

const reportSchema = {
    definitions: seriesDefinitions,
    properties: {
        dates: { elements: { type: 'string' } },
        series: { elements: { ref: 'series' } },
    },
};

const hierarchicalReportSchema = {
    properties: {
        dates: { elements: { type: 'string' } },
        series: {
            elements: {
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                },
                optionalProperties: {
                    parent: { type: 'string' },
                    value: { type: 'float32' },
                },
            },
        },
    },
};

const budgetExecutionReportSchema = {
    properties: {
        dates: { elements: { type: 'string' } },
        actual_income: { elements: { type: 'float32' } },
        actual_expense: { elements: { type: 'float32' } },
        expected_income: { elements: { type: 'float32' } },
        expected_expense: { elements: { type: 'float32' } },
        profit: { elements: { type: 'float32' } },
    },
};

const budgetCashflowReportSchema = {
    definitions: seriesDefinitions,
    properties: {
        dates: { elements: { type: 'string' } },
        actual: { ref: 'series' },
        expected: { ref: 'series' },
    },
};

const totalsReportParse = ajv.compileParser<Record<string, Model.TotalsReport[]>>(totalsReportSchema);
const evaluationReportParse = ajv.compileParser<Model.EvaluationReport>(evaluationReportSchema);
const reportParse = ajv.compileParser<Model.Report>(reportSchema);
const hierarchicalReportParse = ajv.compileParser<Model.HierarchicalReport>(hierarchicalReportSchema);
const budgetExecutionReportParse = ajv.compileParser<Model.BudgetExecutionReport>(budgetExecutionReportSchema);
const budgetCashflowReportParse = ajv.compileParser<Model.BudgetCashflowReport>(budgetCashflowReportSchema);

export function reportDatesToParams(dates: ReportParams): string {
    const params = new URLSearchParams({
        startDate: dates.startDate.format('YYYY-MM-DD'),
        endDate: dates.endDate.format('YYYY-MM-DD'),
        granularity: String(dates.granularity),
    });
    return '?' + params.toString();
}

export function formatDates(dates: string[]): Result<string[], Model.Problem> {
    const formatted: string[] = [];
    for (const date of dates) {
        const parsed = moment(date, 'YYYY-MM-DD', true);
        if (!parsed.isValid()) {
            return new Err(Errors.InvalidObject(`Invalid report date: ${date}`));
        }
        formatted.push(parsed.format("DD. MMM' YY"));
    }
    return new Ok(formatted);
}

let evaluationCache: { etag: string; report: Model.EvaluationReport } | null = null;

export function resetEvaluationCache(): void {
    evaluationCache = null;
}

export async function loadTotalsReport(): Promise<Result<Model.TotalsReport[], Model.Problem>> {
    const response = await fetch('/api/reports/totals');
    return parseListResponse(response, totalsReportParse, 'report');
}

export async function loadEvaluationReport(
    etag: string | null
): Promise<Result<readonly [Option<Model.EvaluationReport>, string], Model.Problem>> {
    const headers: Record<string, string> = {};
    // Send the ETag only if the body it stands for is held here, otherwise a 304 would leave nothing to show.
    if (etag != null && evaluationCache != null && evaluationCache.etag === etag) {
        headers['If-None-Match'] = etag;
    }
    const response = await fetch('/api/reports/evaluation', { method: 'GET', headers: headers });
    const responseEtag = response.headers.get('etag') as string;
    if (response.status == 304 && evaluationCache != null) {
        return new Ok([Some(evaluationCache.report), responseEtag ?? evaluationCache.etag]);
    }
    const parsed = await parseResponse(response, evaluationReportParse);
    return parsed.map(result => {
        if (responseEtag != null) {
            evaluationCache = { etag: responseEtag, report: result };
        }
        return [Some(result), responseEtag] as const;
    });
}

export async function loadAssetReport(
    type: string,
    params: ReportParams
): Promise<Result<Model.Report, Model.Problem>> {
    const url = `/api/reports/${type}/${reportDatesToParams(params)}`;
    const response = await fetch(url);
    const parsed = await parseResponse(response, reportParse);
    return parsed.andThen(report => formatDates(report.dates).map(dates => ({ dates: dates, series: report.series })));
}

export async function loadEventsReport(
    type: string,
    params: ReportParams
): Promise<Result<Model.PieData, Model.Problem>> {
    const url = `/api/reports/${type}/accounts/${reportDatesToParams(params)}`;
    const response = await fetch(url);
    const parsed = await parseResponse(response, hierarchicalReportParse);
    return parsed.andThen(report => formatDates(report.dates).map(dates => ({ dates: dates, data: report.series })));
}

export async function loadBudgetReport(
    params: ReportParams
): Promise<Result<Model.BudgetExecutionReport, Model.Problem>> {
    const url = `/api/reports/budget/execution/${reportDatesToParams(params)}`;
    const response = await fetch(url);
    const parsed = await parseResponse(response, budgetExecutionReportParse);
    return parsed.andThen(report => formatDates(report.dates).map(dates => ({ ...report, dates: dates })));
}

export async function loadBudgetCashflowReport(id: number): Promise<Result<Model.BudgetCashflowReport, Model.Problem>> {
    const url = `/api/reports/budget/cashflow/${id}`;
    const response = await fetch(url);
    const parsed = await parseResponse(response, budgetCashflowReportParse);
    return parsed.andThen(report => formatDates(report.dates).map(dates => ({ ...report, dates: dates })));
}
