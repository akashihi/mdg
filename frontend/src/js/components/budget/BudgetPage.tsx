import React, {Fragment, useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import ClipLoader from 'react-spinners/ClipLoader';

import BudgetEntry from './BudgetEntry'
import BudgetSelector from '../../containers/BudgetSelector'
import BudgetInfo from './BudgetInfo'
import {BudgetViewerProps} from "../../containers/BudgetViewer";

const cardStyle = {
    padding: '0px',
    paddingBottom: '16px'
};

/*class HiddenEntriesButton extends Component {
    render() {
        return ()
    }
}*/

export function BudgetPage(props: BudgetViewerProps) {
    const [showEmpty, setShowEmpty] = useState<boolean>(false);
    /*onHiddenEntriesClick() {
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

        return (
                <Card>
                    <CardActions>
                        {hiddenButton}
                    </CardActions>
                    <BudgetInfo budget={props.budget}/>
                </Card>
                <Divider/>
                {::this.renderBudget()}
        )
    }*/

    let emptyHiddenButton;
    if (showEmpty) {
        emptyHiddenButton = <Button onClick={() => setShowEmpty(false)}>Hide empty entries</Button>
    } else {
        emptyHiddenButton = <Button onClick={() => setShowEmpty(true)}>Show empty entries</Button>
    }
    return <Fragment>
        <BudgetSelector/>
        <Card>
            <CardActions>
                {emptyHiddenButton}
            </CardActions>
            <CardContent>
                <BudgetInfo budget={props.budget} short={false}/>
            </CardContent>
        </Card>
    </Fragment>;
}

export default BudgetPage;
