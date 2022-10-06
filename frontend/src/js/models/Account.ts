import {Currency} from '../api/model';
import Category from './Category';

export interface Account {
    readonly id: number;
    readonly account_type: string;
    readonly currency_id: number;
    readonly currency?: Currency;
    category_id?: number;
    category?: Category;
    name: string;
    balance: number;
    primary_balance: number;
    hidden?: boolean;
    operational: boolean;
    favorite: boolean;
}

export interface AccountTreeNode {
    id?: number;
    name?: string;
    accounts: Account[];
    categories: AccountTreeNode[];
}
