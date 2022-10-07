import {Currency, Category} from '../model';

export type AccountType = "ASSET" | "INCOME" | "EXPENSE";

export interface Account {
    readonly id: number;
    readonly account_type: AccountType;
    readonly currency_id: number;
    readonly currency?: Currency;
    readonly category_id?: number;
    readonly category?: Category;
    readonly name: string;
    readonly balance: number;
    readonly primary_balance: number;
    readonly hidden?: boolean;
    readonly operational: boolean;
    readonly favorite: boolean;
}

export interface AccountTreeNode {
    readonly id?: number;
    readonly name?: string;
    readonly accounts: Account[];
    readonly categories: AccountTreeNode[];
}
