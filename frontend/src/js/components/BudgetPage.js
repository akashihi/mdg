import React, {Component} from 'react';
import {Card, CardActions} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';

import BudgetEntry from './BudgetEntry'
import BudgetSelector from '../containers/BudgetSelector'
import BudgetOverviewPanel from './BudgetOverviewPanel'

export default class BudgetPage extends Component {
    onOpenBudgetListClick() {
        this.props.actions.toggleBudgetSelector(true)
    }

    mapEntry(item) {
        var props = this.props;

        var account;
        var accountIndex = props.incomeAccounts.map((item) => item.id).indexOf(item.attributes.account_id);
        if (accountIndex != -1) {
            account = props.incomeAccounts[accountIndex]
        } else {
            accountIndex = props.expenseAccounts.map((item) => item.id).indexOf(item.attributes.account_id);
            if (accountIndex != -1) {
                account = props.expenseAccounts[accountIndex]
            }
        }
        return (
            <BudgetEntry entry={item} key={item.id} account={account}
                         saveBudgetEntryChange={props.entryActions.updateBudgetEntry}/>
        )
    }

    render() {
        var props = this.props;

        var entries;
        if (props.loading) {
            entries = <CircularProgress/>
        } else if (props.error) {
            entries = <h1>Unable to load budget entries</h1>
        } else {
            var incomeEntries = props.entries.filter((item) => props.incomeAccounts.map((item) => item.id).includes(item.attributes.account_id)).map(::this.mapEntry);
            var assetEntries = props.entries.filter((item) => props.expenseAccounts.map((item) => item.id).includes(item.attributes.account_id)).map(::this.mapEntry);
            entries = incomeEntries.concat(assetEntries)
        }

        return (
            <div>
                <BudgetSelector/>
                <Card>
                    <CardActions>
                        <IconButton onClick={this.onOpenBudgetListClick.bind(this)}><FontIcon
                            className='material-icons'>chevron_left</FontIcon></IconButton>
                    </CardActions>
                    <BudgetOverviewPanel budget={props.budget}/>
                </Card>
                <Divider/>
                <Card>
                    {entries}
                </Card>
            </div>
        )
    }
}
