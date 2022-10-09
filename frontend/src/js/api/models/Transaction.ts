import { Account } from './Account';

export interface Operation {
    readonly rate?: number;
    readonly amount: number;
    readonly account_id: number;
    readonly account?: Account;
}

export interface EnrichedOperation extends Operation {
    readonly color: string;
}

export interface EditedOperation extends Operation {
    rateValue: string;
    amountValue: string;
}

export interface Transaction {
    readonly id: number;
    comment?: string;
    tags?: string[];
    timestamp: string;
    readonly operations: Operation[];
}

export interface TransactionSummary {
    readonly total: number;
    readonly color: string;
}

export interface EnrichedTransaction extends Transaction {
    readonly dt: string;
    readonly accountNames: string;
    readonly summary: TransactionSummary;
    readonly operations: EnrichedOperation[];
}

export interface EditedTransaction extends Transaction {
    editedOperations: EditedOperation[];
}

export interface TransactionList {
    readonly transactions: Transaction[];
    readonly self: string;
    readonly first: string;
    readonly next: string;
    readonly left: number;
}
