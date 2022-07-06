import {createSelector} from 'reselect';
import {getAccounts} from "./StateGetters";
import {Account} from "../models/Account";

export interface AccountTotals {
    total: number;
    favorite: number;
    operational: number;
}

export const selectAssetAccount = createSelector(
    [getAccounts], (accounts: Account[]) => accounts.filter(a => a.account_type === 'ASSET')
)

export const selectIncomeAccount = createSelector(
    [getAccounts], (accounts: Account[]) => accounts.filter(a => a.account_type === 'INCOME')
)

export const selectExpenseAccount = createSelector(
    [getAccounts], (accounts: Account[]) => accounts.filter(a => a.account_type === 'EXPENSE')
)

export const selectFavoriteAccounts = createSelector(
    [selectAssetAccount], (accounts: Account[]) => accounts.filter(a => a.favorite && !a.hidden)
)

const primarySum = (accounts: Account[]) => accounts.reduce((prev, item) => prev + item.primary_balance * 100, 0)/100;

export const selectAccountTotals = createSelector(
    [selectAssetAccount], (accounts: Account[]): AccountTotals => {
        return {
            total: primarySum(accounts),
            favorite: primarySum(accounts.filter(item => item.favorite)),
            operational: primarySum(accounts.filter(item => item.operational))
        }
    }
)


export const selectAccountNames = createSelector(
    [getAccounts], (accounts: Account[]):Record<number, string> => Object.fromEntries(accounts.map(a => [a.id, a.name]))
)
