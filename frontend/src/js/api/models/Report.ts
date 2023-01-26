import { PointOptionsObject } from 'highcharts';

export interface ReportAmount {
    amount: number;
    name?: string;
    data?: Date;
}

export interface TotalsReport {
    category_name: string;
    primary_balance: number;
    amounts: ReportAmount[];
}

export interface ReportSeries {
    name: string;
    data: number[];
    custom: number[];
    type: string;
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

export interface PieData {
    readonly dates: string[];
    readonly data: PointOptionsObject[];
}
