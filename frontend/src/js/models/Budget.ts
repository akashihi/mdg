import { Account } from './Account';
import {Category} from '../api/model';

export interface BudgetPair {
    actual: number;
    expected: number;
}

export interface BudgetState {
    income: BudgetPair;
    expense: BudgetPair;
    allowed: BudgetPair;
}

export interface ShortBudget {
    id: string;
    term_beginning: string;
    term_end: string;
}

export interface Budget extends ShortBudget {
    state: BudgetState;
    incoming_amount: number;
    outgoing_amount: BudgetPair;
}

export type BudgetEntryMode = 'SINGLE' | 'EVEN' | 'PRORATED';
export interface BudgetEntry {
    id: number;
    account_id: number;
    account: Account;
    category_id: number;
    category: Category;
    readonly distribution: BudgetEntryMode;
    expected_amount: number;
    actual_amount: number;
    allowed_spendings: number;
    spending_percent: number;
}

export interface BudgetEntryTreeNode {
    id: number;
    name: string;
    expected_amount: number;
    actual_amount: number;
    allowed_spendings: number;
    spending_percent: number;
    entries: BudgetEntry[];
    categories: BudgetEntryTreeNode[];
}
