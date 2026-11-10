import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Result } from 'ts-results';
import moment from 'moment/moment';
import {
    formatDates,
    loadAssetReport,
    loadBudgetCashflowReport,
    loadBudgetReport,
    loadEvaluationReport,
    loadEventsReport,
    loadTotalsReport,
    ReportParams,
    reportDatesToParams,
    resetEvaluationCache,
} from '../../src/js/api/Reports';

const FIXTURES = join(__dirname, '..', 'fixtures', 'reports');

function fixture(name: string): string {
    return readFileSync(join(FIXTURES, name), 'utf8');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

function fixtureJson(name: string): Json {
    return JSON.parse(fixture(name));
}

function fixtureEtag(): string {
    const match = /^ETag: (.*)$/im.exec(fixture('evaluation.headers'));
    return (match as RegExpExecArray)[1].trim();
}

const params: ReportParams = {
    startDate: moment('2017-02-01', 'YYYY-MM-DD'),
    endDate: moment('2017-02-28', 'YYYY-MM-DD'),
    granularity: 7,
    primaryCurrencyName: 'EUR',
};

let fetchSpy: ReturnType<typeof jest.spyOn>;

function respondWith(body: string | null, status = 200, headers: Record<string, string> = {}): void {
    fetchSpy.mockImplementation(async () => new Response(body, { status, headers }));
}

function expectOk<T, E>(result: Result<T, E>): T {
    if (!result.ok) {
        throw new Error('Expected Ok, got Err: ' + JSON.stringify(result.val));
    }
    return result.val;
}

function expectErr<T, E>(result: Result<T, E>): E {
    if (result.ok) {
        throw new Error('Expected Err, got Ok: ' + JSON.stringify(result.val));
    }
    return result.val;
}

beforeEach(() => {
    fetchSpy = jest.spyOn(globalThis, 'fetch');
    resetEvaluationCache();
});

afterEach(() => {
    fetchSpy.mockRestore();
});

interface Invalid {
    name: string;
    mutate: (body: Json) => void;
}

interface LoaderCase {
    name: string;
    fixtures: string[];
    load: () => Promise<Result<unknown, { code: string }>>;
    invalid: Invalid[];
}

const reportInvalid: Invalid[] = [
    { name: 'missing series', mutate: b => delete b.series },
    { name: 'missing dates', mutate: b => delete b.dates },
    { name: 'mistyped dates', mutate: b => (b.dates = 'x') },
    { name: 'mistyped date item', mutate: b => (b.dates = [20170208]) },
    { name: 'extra field', mutate: b => (b.extra = 1) },
    { name: 'missing series name', mutate: b => delete b.series[0].name },
    { name: 'unknown series type', mutate: b => (b.series[0].type = 'pie') },
    { name: 'bare number datapoint', mutate: b => (b.series[0].data = [1]) },
    { name: 'datapoint without custom', mutate: b => delete b.series[0].data[0].custom },
    { name: 'mistyped datapoint y', mutate: b => (b.series[0].data[0].y = '1') },
    { name: 'extra datapoint field', mutate: b => (b.series[0].data[0].extra = 1) },
    { name: 'extra series field', mutate: b => (b.series[0].extra = 1) },
];

const hierarchicalInvalid: Invalid[] = [
    { name: 'missing series', mutate: b => delete b.series },
    { name: 'missing dates', mutate: b => delete b.dates },
    { name: 'mistyped series', mutate: b => (b.series = {}) },
    { name: 'extra field', mutate: b => (b.extra = 1) },
    { name: 'missing entry id', mutate: b => delete b.series[0].id },
    { name: 'mistyped entry id', mutate: b => (b.series[0].id = 1) },
    { name: 'mistyped entry value', mutate: b => (b.series[b.series.length - 1].value = 'x') },
    { name: 'extra entry field', mutate: b => (b.series[0].extra = 1) },
];

const budgetInvalid: Invalid[] = [
    { name: 'missing profit', mutate: b => delete b.profit },
    { name: 'missing dates', mutate: b => delete b.dates },
    { name: 'mistyped actual_income', mutate: b => (b.actual_income = ['a']) },
    { name: 'mistyped expected_expense', mutate: b => (b.expected_expense = 1) },
    { name: 'extra field', mutate: b => (b.extra = 1) },
];

const cashflowInvalid: Invalid[] = [
    { name: 'missing expected', mutate: b => delete b.expected },
    { name: 'missing dates', mutate: b => delete b.dates },
    { name: 'series array instead of single series', mutate: b => (b.actual = [b.actual]) },
    { name: 'unknown series type', mutate: b => (b.actual.type = 'pie') },
    { name: 'bare number datapoint', mutate: b => (b.expected.data = [1]) },
    { name: 'extra field', mutate: b => (b.extra = 1) },
    { name: 'extra series field', mutate: b => (b.expected.extra = 1) },
];

const loaderCases: LoaderCase[] = [
    ...['assets/simple', 'assets/currency', 'assets/type', 'income/events', 'expense/events'].map(path => ({
        name: `loadAssetReport(${path})`,
        fixtures: [path.replace('/', '-') + '.json'],
        load: () => loadAssetReport(path, params),
        invalid: reportInvalid,
    })),
    ...['income', 'expense'].map(type => ({
        name: `loadEventsReport(${type})`,
        fixtures: [`${type}-accounts.json`],
        load: () => loadEventsReport(type, params),
        invalid: hierarchicalInvalid,
    })),
    {
        name: 'loadBudgetReport',
        fixtures: ['budget-execution.json'],
        load: () => loadBudgetReport(params),
        invalid: budgetInvalid,
    },
    {
        name: 'loadBudgetCashflowReport',
        fixtures: ['budget-cashflow.json'],
        load: () => loadBudgetCashflowReport(20170204),
        invalid: cashflowInvalid,
    },
];

describe.each(loaderCases)('$name', loaderCase => {
    it.each(loaderCase.fixtures)('accepts captured %s and reformats dates', async name => {
        respondWith(fixture(name));
        const value = expectOk(await loaderCase.load()) as { dates: string[] };
        const wire = fixtureJson(name);
        expect(value.dates).toEqual(wire.dates.map((d: string) => moment(d, 'YYYY-MM-DD').format("DD. MMM' YY")));
        expect(value.dates[0]).toMatch(/^\d\d\. [A-Z][a-z]{2}' \d\d$/);
    });

    it.each(loaderCase.invalid)('rejects $name', async invalid => {
        const body = fixtureJson(loaderCase.fixtures[0]);
        invalid.mutate(body);
        respondWith(JSON.stringify(body));
        expectErr(await loaderCase.load());
    });

    it('rejects a malformed date', async () => {
        const body = fixtureJson(loaderCase.fixtures[0]);
        body.dates[0] = '2017-13-45';
        respondWith(JSON.stringify(body));
        expectErr(await loaderCase.load());
    });

    it('returns the backend Problem with its code', async () => {
        respondWith(fixture('problem.json'), 400);
        const problem = expectErr(await loaderCase.load());
        expect(problem.code).toBe(fixtureJson('problem.json').code);
    });

    it('returns Err for a non-JSON error body', async () => {
        respondWith('<html>Bad gateway</html>', 502);
        const problem = expectErr(await loaderCase.load());
        expect(problem.code).toBe('BACKEND_ERROR');
    });

    it('returns Err for an empty error body', async () => {
        respondWith('', 502);
        expectErr(await loaderCase.load());
    });
});

describe('report payload shapes', () => {
    it('keeps {y, custom} datapoints untouched', async () => {
        respondWith(fixture('assets-currency.json'));
        const report = expectOk(await loadAssetReport('assets/currency', params));
        expect(report.series).toEqual(fixtureJson('assets-currency.json').series);
        expect(report.series[1].data[0]).toEqual({ y: 176, custom: 200 });
    });

    it('maps hierarchical series onto PieData.data', async () => {
        respondWith(fixture('expense-accounts.json'));
        const report = expectOk(await loadEventsReport('expense', params));
        expect(report.data).toEqual(fixtureJson('expense-accounts.json').series);
    });

    it('requests the expected urls', async () => {
        respondWith(fixture('budget-cashflow.json'));
        await loadBudgetCashflowReport(20170204);
        expect(fetchSpy.mock.calls[0][0]).toBe('/api/reports/budget/cashflow/20170204');
        respondWith(fixture('income-accounts.json'));
        await loadEventsReport('income', params);
        expect(fetchSpy.mock.calls[1][0]).toBe(
            '/api/reports/income/accounts/?startDate=2017-02-01&endDate=2017-02-28&granularity=7'
        );
    });
});

describe('formatDates', () => {
    it('formats valid dates', () => {
        expect(expectOk(formatDates(['2017-02-04', '2017-12-31']))).toEqual(["04. Feb' 17", "31. Dec' 17"]);
    });

    it('rejects an invalid date', () => {
        expectErr(formatDates(['2017-02-04', '2017-02-30']));
        expectErr(formatDates(['04.02.2017']));
        expectErr(formatDates(['']));
    });
});

describe('reportDatesToParams', () => {
    it('produces the query string', () => {
        expect(reportDatesToParams(params)).toBe('?startDate=2017-02-01&endDate=2017-02-28&granularity=7');
    });
});

describe('loadTotalsReport', () => {
    it('accepts the captured fixture', async () => {
        respondWith(fixture('totals.json'));
        const totals = expectOk(await loadTotalsReport());
        expect(totals).toEqual(fixtureJson('totals.json').report);
    });

    it('accepts an amount with a date', async () => {
        const body = fixtureJson('totals.json');
        body.report[1].amounts[0].date = '2017-02-04';
        respondWith(JSON.stringify(body));
        const totals = expectOk(await loadTotalsReport());
        expect(totals[1].amounts[0].date).toBe('2017-02-04');
    });

    const invalid: Invalid[] = [
        { name: 'missing report', mutate: b => delete b.report },
        { name: 'missing category_name', mutate: b => delete b.report[0].category_name },
        { name: 'mistyped primary_balance', mutate: b => (b.report[0].primary_balance = '1') },
        { name: 'missing amount name', mutate: b => delete b.report[1].amounts[0].name },
        { name: 'mistyped amount', mutate: b => (b.report[1].amounts[0].amount = 'x') },
        { name: 'timestamp date', mutate: b => (b.report[1].amounts[0].date = 1486166400) },
        { name: 'legacy data field', mutate: b => (b.report[1].amounts[0].data = '2017-02-04') },
        { name: 'extra amount field', mutate: b => (b.report[1].amounts[0].extra = 1) },
        { name: 'extra entry field', mutate: b => (b.report[0].extra = 1) },
        { name: 'extra field', mutate: b => (b.extra = 1) },
    ];

    it.each(invalid)('rejects $name', async item => {
        const body = fixtureJson('totals.json');
        item.mutate(body);
        respondWith(JSON.stringify(body));
        expectErr(await loadTotalsReport());
    });

    it('returns the backend Problem with its code', async () => {
        respondWith(fixture('problem.json'), 400);
        expect(expectErr(await loadTotalsReport()).code).toBe('REQUEST_PARAMETER_INVALID');
    });

    it('returns Err for a non-JSON error body', async () => {
        respondWith('<html>Bad gateway</html>', 502);
        expectErr(await loadTotalsReport());
    });
});

describe('loadEvaluationReport', () => {
    const etag = fixtureEtag();

    function sentHeaders(call: number): Record<string, string> {
        const init = fetchSpy.mock.calls[call][1] as RequestInit;
        return (init.headers ?? {}) as Record<string, string>;
    }

    it('accepts the captured fixture and returns the ETag', async () => {
        respondWith(fixture('evaluation.json'), 200, { ETag: etag });
        const [report, responseEtag] = expectOk(await loadEvaluationReport(null));
        expect(report.unwrap()).toEqual(fixtureJson('evaluation.json'));
        expect(responseEtag).toBe(etag);
        expect(sentHeaders(0)['If-None-Match']).toBeUndefined();
    });

    const invalid: Invalid[] = [
        { name: 'missing field', mutate: b => delete b.state },
        { name: 'mistyped field', mutate: b => (b.cash = 'x') },
        { name: 'extra field', mutate: b => (b.extra = 1) },
    ];

    it.each(invalid)('rejects $name', async item => {
        const body = fixtureJson('evaluation.json');
        item.mutate(body);
        respondWith(JSON.stringify(body), 200, { ETag: etag });
        expectErr(await loadEvaluationReport(null));
    });

    it('returns the backend Problem with its code', async () => {
        respondWith(fixture('problem.json'), 400);
        expect(expectErr(await loadEvaluationReport(null)).code).toBe('REQUEST_PARAMETER_INVALID');
    });

    it('returns Err for a non-JSON error body', async () => {
        respondWith('<html>Bad gateway</html>', 502);
        expectErr(await loadEvaluationReport(null));
    });

    it('sends If-None-Match in headers after a 200 and returns the cached report on 304', async () => {
        respondWith(fixture('evaluation.json'), 200, { ETag: etag });
        expectOk(await loadEvaluationReport(null));

        respondWith(null, 304, { ETag: etag });
        const [report, responseEtag] = expectOk(await loadEvaluationReport(etag));
        expect(sentHeaders(1)['If-None-Match']).toBe(etag);
        expect(report.unwrap()).toEqual(fixtureJson('evaluation.json'));
        expect(responseEtag).toBe(etag);
    });

    it('does not send an ETag it holds no body for', async () => {
        respondWith(fixture('evaluation.json'), 200, { ETag: etag });
        const [report] = expectOk(await loadEvaluationReport(etag));
        expect(sentHeaders(0)['If-None-Match']).toBeUndefined();
        expect(report.some).toBe(true);
    });

    it('does not send a different ETag than the cached one', async () => {
        respondWith(fixture('evaluation.json'), 200, { ETag: etag });
        expectOk(await loadEvaluationReport(null));
        expectOk(await loadEvaluationReport('"other"'));
        expect(sentHeaders(1)['If-None-Match']).toBeUndefined();
    });

    it('returns Err on a 304 it has no cache for', async () => {
        respondWith(null, 304, { ETag: etag });
        expectErr(await loadEvaluationReport(etag));
    });
});
