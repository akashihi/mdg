import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';

import BudgetEntry from './BudgetEntry'
import BudgetSelector from '../containers/BudgetSelector'

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
            <BudgetEntry entry={item} key={item.id} account={account}/>
        )
    }

    render() {
        var props = this.props;
        var attrs = props.budget.attributes;

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
                    <CardHeader title='1 Apr 2017 - 30 Apr 2017 Budget'/>
                    <CardText>
                        <IconButton onClick={this.onOpenBudgetListClick.bind(this)}><FontIcon className='material-icons'>chevron_left</FontIcon></IconButton>
                        <Divider/>
                        <p>Assets at first budget day: {attrs.incoming_amount}</p>
                        <p>Expected assets at last budget day: {attrs.outgoing_amount.expected}</p>
                        <p>Actual assets at last budget day: {attrs.outgoing_amount.actual}</p>
                        <p>Income: 1500 actual / 8080 expected</p>
                        <p>Spendings: 9000 actual / 270 expected</p>
                        <p>Today's spending: 0 allowed/ 2600 actual</p>
                        <Divider/>
                        {entries}
                    </CardText>
                </Card>
            </div>
        )
    }
}
