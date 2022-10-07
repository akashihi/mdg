import {AccountType} from "./Account";

export interface Category {
    readonly id?: number;
    readonly parent_id?: number;
    readonly name: string;
    readonly priority: number;
    readonly account_type: AccountType;
    readonly children?: Category[];
}
