import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import React from 'react';
import { AccountTreeNode } from '../models/Account';

function accountList(tree: AccountTreeNode, indent: number, currencyFilter?: number): JSX.Element[] {
    const subCategories = tree.categories.flatMap(c => accountList(c, indent + 1, currencyFilter));
    let filteredAccounts = tree.accounts;
    if (currencyFilter) {
        filteredAccounts = tree.accounts.filter(a => a.currency_id === currencyFilter);
    }
    const accounts = filteredAccounts
        .filter(a => !a.hidden)
        .map(a => (
            <MenuItem
                key={a.id}
                value={a.id}
                style={{ marginLeft: indent * 15 + 10 }}>{`${a.name} (${a.currency.name})`}</MenuItem>
        ));
    if (subCategories.length === 0 && accounts.length === 0) {
        // Skip leafs in case there are no accounts and subleafs
        return [];
    }
    if (tree.id !== undefined) {
        return [
            <ListItemText
                key={'category-' + tree.id}
                primary={tree.name}
                style={{
                    fontStyle: 'italic',
                    marginLeft: indent * 15,
                }}
            />,
        ]
            .concat(accounts)
            .concat(subCategories);
    }
    return accounts.concat(subCategories);
}

export function accountMenu(
    asset: AccountTreeNode,
    income: AccountTreeNode,
    expense: AccountTreeNode,
    currencyFilter?: number
) {
    return [<ListSubheader key="asset-header">Asset accounts</ListSubheader>, <Divider key="asset-divider" />]
        .concat(accountList(asset, 0, currencyFilter))
        .concat([
            <ListSubheader key="expense-header">Expense accounts</ListSubheader>,
            <Divider key="expense-divider" />,
        ])
        .concat(accountList(expense, 0, currencyFilter))
        .concat([<ListSubheader key="income-header">Income accounts</ListSubheader>, <Divider key="income-divider" />])
        .concat(accountList(income, 0, currencyFilter));
}
