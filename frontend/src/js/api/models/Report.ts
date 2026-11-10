export interface ReportAmount {
    amount: number;
    name: string;
    // "YYYY-MM-DD"
    date?: string;
}

export interface TotalsReport {
    category_name: string;
    primary_balance: number;
    amounts: ReportAmount[];
}

export interface EvaluationReport {
    income: number;
    debt: number;
    budget: number;
    cash: number;
    state: number;
}

export interface ReportSeriesEntry {
    y: number;
    custom: number;
}

export interface ReportSeries {
    name: string;
    data: ReportSeriesEntry[];
    type: 'area' | 'column' | 'line';
}

export interface Report {
    dates: string[];
    series: ReportSeries[];
}

export interface BudgetExecutionReport {
    dates: string[];
    actual_income: number[];
    actual_expense: number[];
    expected_income: number[];
    expected_expense: number[];
    profit: number[];
}

export interface BudgetCashflowReport {
    dates: string[];
    actual: ReportSeries;
    expected: ReportSeries;
}

export interface HierarchicalSeries {
    id: string;
    parent?: string;
    name: string;
    value?: number;
}

export interface HierarchicalReport {
    dates: string[];
    series: HierarchicalSeries[];
}

export interface PieData {
    readonly dates: string[];
    readonly data: HierarchicalSeries[];
}
