import {OrderedMap} from 'immutable';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import React from 'react';

export function filterNonListedCategories(categories_ids, categoryList) {
    const filterCategory = function(category) {
        var kids = OrderedMap();

        if (category.has('children')) {
            category.get('children').forEach((item, k) => {
                const filtered = filterCategory(item);
                if (filtered != null) {
                    kids = kids.set(k, filtered)
                }
            })
        }

        category = category.set('children', kids);

        if (categories_ids.includes(category.get('id')) || !kids.isEmpty()) {
            return category
        }


        return null
    };

    const entries = [];
    categoryList.forEach(item => {
        const c = filterCategory(item);
        if (c != null) {
            entries.push(c)
        }
    });
    return entries
}

export class AccountMapper {
    constructor(currencies, categories, accounts) {
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

        const cashAcc = nonFavOpsAccounts.filter((item) => item.get('asset_type') === 'cash').map(::this.mapAccountEntry);
        if (!cashAcc.isEmpty()) {
            result.push(<ListItemText key='asset-cash' primary='Cash' style={{fontStyle: 'italic'}}/>);
            result = result.concat(cashAcc.valueSeq().toJS());
        }
        const currAcc = nonFavOpsAccounts.filter((item) => item.get('asset_type') === 'current').map(::this.mapAccountEntry);
        if (!currAcc.isEmpty()) {
            result.push(<ListItemText key='asset-current' primary='Current' style={{fontStyle: 'italic'}}/>);
            result = result.concat(currAcc.valueSeq().toJS());
        }
        const savAcc = nonFavOpsAccounts.filter((item) => item.get('asset_type') === 'savings').map(::this.mapAccountEntry);
        if (!savAcc.isEmpty()) {
            result.push(<ListItemText key='asset-savings' primary='Savings' style={{fontStyle: 'italic'}}/>);
            result = result.concat(savAcc.valueSeq().toJS());
        }
        const depAcc = nonFavOpsAccounts.filter((item) => item.get('asset_type') === 'deposit').map(::this.mapAccountEntry);
        if (!depAcc.isEmpty()) {
            result.push(<ListItemText key='asset-deposit' primary='Deposit' style={{fontStyle: 'italic'}}/>);
            result = result.concat(depAcc.valueSeq().toJS());
        }
        const credAcc = nonFavOpsAccounts.filter((item) => item.get('asset_type') === 'credit').map(::this.mapAccountEntry);
        if (!credAcc.isEmpty()) {
            result.push(<ListItemText key='asset-credit' primary='Credit' style={{fontStyle: 'italic'}}/>);
            result = result.concat(credAcc.valueSeq().toJS());
        }
        const debtAcc = nonFavOpsAccounts.filter((item) => item.get('asset_type') === 'debt').map(::this.mapAccountEntry);
        if (!debtAcc.isEmpty()) {
            result.push(<ListItemText key='asset-debt' primary='Debt' style={{fontStyle: 'italic'}}/>);
            result = result.concat(debtAcc.valueSeq().toJS());
        }
        const broAcc = nonFavOpsAccounts.filter((item) => item.get('asset_type') === 'broker').map(::this.mapAccountEntry);
        if (!broAcc.isEmpty()) {
            result.push(<ListItemText key='asset-broker' primary='Broker' style={{fontStyle: 'italic'}}/>);
            result = result.concat(broAcc.valueSeq().toJS());
        }
        const tradAcc = nonFavOpsAccounts.filter((item) => item.get('asset_type') === 'tradable').map(::this.mapAccountEntry);
        if (!tradAcc.isEmpty()) {
            result.push(<ListItemText key='asset-tradable' primary='Tradable' style={{fontStyle: 'italic'}}/>);
            result = result.concat(tradAcc.valueSeq().toJS());
        }

        //Categorized expenses go next
        result.push(<ListSubheader key='expense-header'>Expense accounts</ListSubheader>);
        result.push(<Divider key='expense-divider'/>);
        result = result.concat(this.categorizeAccounts('expense', filtered_accounts));

        //Finally categorized incomes
        result.push(<ListSubheader key='income-header'>Income accounts</ListSubheader>);
        result.push(<Divider key='income-divider'/>);
        result = result.concat(this.categorizeAccounts('income', filtered_accounts));

        return result;
    }

    getAccounts() {
        return this.renderAccounts(this.accounts)
    }

    getLimitedAccounts(operation) {
        if (operation.account_id) {
            if (this.accounts.has(operation.account_id)) {
                const leftAccount = this.accounts.has(operation.account_id);
                const limitedAccounts = this.accounts.filter((item) => item.get('currency_id') === leftAccount.get('currency_id'));
                return this.renderAccounts(limitedAccounts)
            }
        }
        return this.renderAccounts(this.accounts)
    }
}
