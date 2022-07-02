export interface ReportAmount {
    amount: number;
    name?: string;
    data: Date
}

export interface TotalsReport {
    category_name: string;
    primary_balance: number;
    amounts: ReportAmount[]
}
