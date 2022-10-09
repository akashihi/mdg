import { Account } from './Account';
import {Category} from './Category';

export interface BudgetPair {
    readonly actual: number;
    readonly expected: number;
}

export interface BudgetState {
    readonly income: BudgetPair;
    readonly expense: BudgetPair;
    readonly allowed: BudgetPair;
}

export interface ShortBudget {
    readonly id: number;
    readonly term_beginning: string;
    readonly term_end: string;
}

export interface Budget extends ShortBudget {
    readonly state: BudgetState;
    readonly incoming_amount: number;
    readonly outgoing_amount: BudgetPair;
}

export type BudgetEntryMode = 'SINGLE' | 'EVEN' | 'PRORATED';
export interface BudgetEntry {
    readonly id: number;
    readonly account_id: number;
    readonly account?: Account;
    readonly category_id?: number;
    readonly category?: Category;
    readonly distribution: BudgetEntryMode;
    readonly expected_amount: number;
    readonly actual_amount: number;
    readonly allowed_spendings: number;
    readonly spending_percent: number;
}

export interface BudgetEntryTreeNode {
    readonly id: number;
    readonly name: string;
    readonly expected_amount: number;
    readonly actual_amount: number;
    readonly allowed_spendings: number;
    readonly spending_percent: number;
    readonly entries: BudgetEntry[];
    readonly categories: BudgetEntryTreeNode[];
}
