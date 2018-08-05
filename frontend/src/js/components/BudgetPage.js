import React, {Component} from 'react';
import {Card, CardActions} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';

import BudgetEntry from './BudgetEntry'
import BudgetSelector from '../containers/BudgetSelector'
import BudgetOverviewPanel from './BudgetOverviewPanel'

export default class BudgetPage extends Component {
    onOpenBudgetListClick() {
        this.props.actions.toggleBudgetSelector(true)
    }

    onHiddenEntriesClick() {
        this.props.actions.toggleHiddenEntries(!this.props.emptyVisible)
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

        var currency = props.currencies.filter((item) => item.id == account.attributes.currency_id)[0]

        return (
            <BudgetEntry entry={item} key={item.id} currency={currency}
                         saveBudgetEntryChange={props.entryActions.updateBudgetEntry}/>
        )
    }

    render() {
        var props = this.props;

        var hiddenButtonStyle = {
            'float': 'right'
        };

        var hiddenButton;
        if (props.emptyVisible) {
            hiddenButton = <FlatButton style={hiddenButtonStyle} label='Hide empty entries' onClick={this.onHiddenEntriesClick.bind(this)}/>
        } else {
            hiddenButton = <FlatButton style={hiddenButtonStyle} label='Show empty entries' onClick={this.onHiddenEntriesClick.bind(this)}/>
        }


        var entries;
        if (props.loading) {
            entries = <CircularProgress/>
        } else if (props.error) {
            entries = <h1>Unable to load budget entries</h1>
        } else {
            var nonEmptyEntries = props.entries
            if (!props.emptyVisible) {
                nonEmptyEntries = props.entries.filter((item) => item.attributes.actual_amount !== 0 || item.attributes.expected_amount !== 0);
            }
            var incomeEntries = nonEmptyEntries.filter((item) => props.incomeAccounts.map((item) => item.id).includes(item.attributes.account_id)).map(::this.mapEntry);
            var expenseEntries = nonEmptyEntries.filter((item) => props.expenseAccounts.map((item) => item.id).includes(item.attributes.account_id)).map(::this.mapEntry);
            entries = incomeEntries.concat(expenseEntries)
        }

        return (
            <div>
                <BudgetSelector/>
                <Card>
                    <CardActions>
                        <IconButton onClick={this.onOpenBudgetListClick.bind(this)}><FontIcon
                            className='material-icons'>chevron_left</FontIcon></IconButton>
                        {hiddenButton}
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
