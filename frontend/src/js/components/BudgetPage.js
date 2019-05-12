import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ClipLoader from 'react-spinners/ClipLoader';

import BudgetEntry from './BudgetEntry'
import BudgetSelector from '../containers/BudgetSelector'
import BudgetOverviewPanel from './BudgetOverviewPanel'

const styles = {
    hiddenButtonStyle: {
        'float': 'right'
    }
};
const cardStyle = {
    padding: '0px',
    paddingBottom: '16px'
};

class HiddenEntriesButtonStyle extends Component {
    render() {
        return (<Button onClick={this.props.handlerFunc}>{this.props.text}</Button>)
    }
}

const HiddenEntriesButton = withStyles(styles)(HiddenEntriesButtonStyle);

export default class BudgetPage extends Component {
    onHiddenEntriesClick() {
        this.props.actions.toggleHiddenEntries(!this.props.emptyVisible)
    }

    mapEntry(item, id) {
        const props = this.props;

        const account = props.accounts.get(item.get('account_id'));

        const currency = props.currencies.get(account.get('currency_id'));

        return (
            <BudgetEntry entry={item} id={id} key={id} currency={currency}
                         saveBudgetEntryChange={props.entryActions.updateBudgetEntry}/>
        )
    }

    renderEntries(entries, type) {
        const props = this.props;
        const mappedEntries = entries.filter((item) => props.accounts.filter((v) => v.get('account_type') === type).keySeq().toJS().includes(item.get('account_id'))).map(::this.mapEntry).valueSeq();

        return  (
            <Card style={cardStyle}>
                <CardHeader style={{paddingTop: '0px'}} title={type.charAt(0).toUpperCase() + type.slice(1)}/>
                <CardContent>{mappedEntries}</CardContent>
            </Card>
        );

    }

    renderBudget() {
        const props = this.props;

        if (props.loading) {
            return <ClipLoader sizeUnit={'px'} size={150} loading={true}/>
        }

        if (props.error) {
            return <h1>Unable to load budget entries</h1>
        }

        let nonEmptyEntries = props.entries;
        if (!props.emptyVisible) {
            nonEmptyEntries = props.entries.filter((item) => item.get('actual_amount') !== 0 || item.get('expected_amount') !== 0);
        }

        const incomeCard = this.renderEntries(nonEmptyEntries, 'income');
        const expenseCard = this.renderEntries(nonEmptyEntries, 'expense');

        return (<Fragment>
            {incomeCard}
            {expenseCard}
        </Fragment>);

    }

    render() {
        const props = this.props;

        let hiddenButton;
        if (props.emptyVisible) {
            hiddenButton =
                <HiddenEntriesButton text='Hide empty entries' handlerFunc={this.onHiddenEntriesClick.bind(this)}/>
        } else {
            hiddenButton =
                <HiddenEntriesButton text='Show empty entries' handlerFunc={this.onHiddenEntriesClick.bind(this)}/>
        }

        return (
            <div>
                <BudgetSelector/>
                <Card>
                    <CardActions>
                        {hiddenButton}
                    </CardActions>
                    <BudgetOverviewPanel budget={props.budget}/>
                </Card>
                <Divider/>
                {::this.renderBudget()}
            </div>
        )
    }
}
