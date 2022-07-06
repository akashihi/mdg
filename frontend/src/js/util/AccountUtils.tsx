import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import React from 'react';
import {AccountTreeNode} from "../models/Account";

function accountList(tree: AccountTreeNode, indent: number) {
    const subCategories = tree.categories.map( c => accountList(c, indent+1));
    const accounts = tree.accounts.filter(a => !a.hidden).map(a => <MenuItem key={a.id} value={a.id} style={{marginLeft: indent*15+10}}>{`${a.name} (${a.currency.name})`}</MenuItem>)
    if (tree.id !== undefined) {
        return [<ListItemText key={'category-'+tree.id} primary={tree.name} style={{fontStyle: 'italic', marginLeft: indent*15}}/>].concat(accounts).concat(subCategories)
    }
        return accounts.concat(subCategories)
}

export function accountMenu(asset: AccountTreeNode, income: AccountTreeNode, expense: AccountTreeNode) {

    return [<ListSubheader key='asset-header'>Asset accounts</ListSubheader>, <Divider key='asset-divider'/>].concat(accountList(asset, 0))
        .concat([<ListSubheader key='expense-header'>Expense accounts</ListSubheader>, <Divider key='expense-divider'/>]).concat(accountList(expense, 0))
        .concat([<ListSubheader key='income-header'>Income accounts</ListSubheader>, <Divider key='income-divider'/>]).concat(accountList(income, 0))
}

export class AccountMapper {
    /*constructor(currencies, categories, accounts) {
        this.currencies = currencies;
        this.categories = categories;
        this.accounts = accounts;
    }

    mapAccountEntry(acc, id) {
        var currencyName = '';
        if (this.currencies.has(acc.get('currency_id'))) {
            currencyName = '(' + this.currencies.get(acc.get('currency_id')).get('name') + ')'
        }

        return (<MenuItem key={id} value={id}>{acc.get('name') + currencyName}</MenuItem>)
    }

    renderCategorizedList(accounts, categoryList) {
        const ths = this;
        var entries = [];

        const mapEntry = function(category, prefix) {
            const prepend = '-'.repeat(prefix);
            const entry = <ListItemText key={'category-'+category.get('id')} primary={prepend+category.get('name')} style={{fontStyle: 'italic'}}/>;
            entries.push(entry);

            //If we have related accounts - add them
            const category_accounts = accounts.filter((item) => item.get('category_id') === category.get('id')).map(::ths.mapAccountEntry);
            entries = entries.concat(category_accounts.valueSeq().toJS());

            if (category.has('children')) {
                category.get('children').forEach((item) => mapEntry(item, prefix+1))
            }
        };

        categoryList.forEach((item) => mapEntry(item, 0));

        return entries
    }

    categorizeAccounts(type, accounts) {
        var result = [];

        const filtered_accounts = accounts.filter((item) => !item.get('hidden'));

        const typed_accounts = filtered_accounts.filter(item => item.get('account_type') === type);
        const categories_ids = typed_accounts.map((item) => item.get('category_id')).valueSeq();
        const categories = filterNonListedCategories(categories_ids, this.categories);
        result = result.concat(this.renderCategorizedList(typed_accounts, categories));
        result.push(<Divider key={'noncategorized-divider-'+type}/>);
        result = result.concat(typed_accounts.filter((item) => !item.get('category_id')).map(::this.mapAccountEntry).valueSeq().toJS());

        return result
    }

    renderAccounts(accounts) {
        var result = [];

        //First asset accounts are manually categorized and rendered
        result.push(<ListSubheader key='asset-header'>Asset accounts</ListSubheader>);
        result.push(<Divider key='asset-divider'/>);

        const filtered_accounts = accounts.filter((item) => !item.get('hidden'));

        //Before all of that - Favorite and Operational
        const favAcc = filtered_accounts.filter((item) => item.get('favorite')).map(::this.mapAccountEntry);
        if (!favAcc.isEmpty()) {
            result.push(<ListItemText key='asset-favorite' primary='Favorite' style={{fontStyle: 'italic'}}/>);
            result = result.concat(favAcc.valueSeq().toJS());
        }
        const opsAcc = filtered_accounts.filter((item) => item.get('operational') && !item.get('favorite')).map(::this.mapAccountEntry);
        if (!opsAcc.isEmpty()) {
            result.push(<ListItemText key='asset-operational' primary='Operational' style={{fontStyle: 'italic'}}/>);
            result = result.concat(opsAcc.valueSeq().toJS());
        }

        const nonFavOpsAccounts = filtered_accounts.filter((item) => !item.get('favorite') && !item.get('operational'));
        result = result.concat(this.categorizeAccounts('asset', nonFavOpsAccounts));

        //Categorized expenses go next
        result.push(<ListSubheader key='expense-header'>Expense accounts</ListSubheader>);
        result.push(<Divider key='expense-divider'/>);
        result = result.concat(this.categorizeAccounts('expense', filtered_accounts));

        //Finally categorized incomes
        result.push(<ListSubheader key='income-header'>Income accounts</ListSubheader>);
        result.push(<Divider key='income-divider'/>);
        result = result.concat(this.categorizeAccounts('income', filtered_accounts));

        return result;
    }*/

    getAccounts() {
        //return this.renderAccounts(this.accounts)
    }

    /*getLimitedAccounts(operation) {
        if (operation.account_id) {
            if (this.accounts.has(operation.account_id)) {
                const leftAccount = this.accounts.get(operation.account_id);
                const limitedAccounts = this.accounts.filter((item) => item.get('currency_id') === leftAccount.get('currency_id'));
                const excludeSameAccount = limitedAccounts.delete(operation.account_id);
                return this.renderAccounts(excludeSameAccount)
            }
        }
        return this.renderAccounts(this.accounts)
    }*/
}
