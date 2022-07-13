import {Account} from "./Account";

export interface Operation {
    rate?: number;
    amount: number;
    account_id: number;
    account?: Account;
}

export interface EnrichedOperation extends Operation {
    color: string;
}

export interface EditedOperation extends Operation {
    rateValue: string;
    amountValue: string;
}

export interface Transaction {
    id: number,
    comment?: string;
    tags?: string[];
    timestamp: string;
    operations: Operation[];
}

export interface TransactionSummary {
    total: number,
    color:string
}

export interface EnrichedTransaction extends Transaction {
    dt: string;
    accountNames: string;
    summary: TransactionSummary;
    operations: EnrichedOperation[];
}

export interface EditedTransaction extends Transaction {
    editedOperations: EditedOperation[];
}
