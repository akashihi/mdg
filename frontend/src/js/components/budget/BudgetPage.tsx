import React, {Fragment, useState, useEffect} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import {BudgetCategoryEntry, BudgetEntry} from './BudgetEntry'
import BudgetSelector from '../../containers/BudgetSelector'
import BudgetInfo from './BudgetInfo'
import {BudgetViewerProps} from "../../containers/BudgetViewer";
import {BudgetEntryTreeNode} from "../../models/Budget";
import { checkApiError, parseJSON} from '../../util/ApiUtils';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';

const cardStyle = {
    padding: '0px',
    paddingBottom: '16px'
};

const mapEntries = (tree: BudgetEntryTreeNode, indent: number, hidden: boolean) => {
    const subCategories = tree.categories.flatMap(c => mapEntries(c, indent +1, hidden));

    let filteredEntries = tree.entries;
    if (!hidden) {
        filteredEntries = tree.entries.filter(e => e.actual_amount !== 0 || e.expected_amount !== 0);
    }
    const entries = filteredEntries.map(e => <ListItemText><BudgetEntry entry={e} indent={indent}/></ListItemText>);
    if (tree.name !== undefined) {
        return [<ListItemText><BudgetCategoryEntry entry={tree} indent={indent}/></ListItemText>].concat(entries).concat(subCategories);
    }
    return entries.concat(subCategories);
}

function BudgetEntries(props: {entries: BudgetEntryTreeNode, title: string, showEmpty: boolean}) {

    return <Card style={cardStyle}>
        <CardHeader style={{paddingTop: '0px'}} title={props.title.charAt(0).toUpperCase() + props.title.slice(1)}/>
        <CardContent>
            <List component='div' disablePadding>
                {mapEntries(props.entries, 0, props.showEmpty)}
            </List>
        </CardContent>
    </Card>
}

export function BudgetPage(props: BudgetViewerProps) {
    const [showEmpty, setShowEmpty] = useState<boolean>(false);
    const [incomeEntries, setIncomeEntries] = useState<BudgetEntryTreeNode|null>(null);
    const [expenseEntries, setExpenseEntries] = useState<BudgetEntryTreeNode|null>(null);

    useEffect(() => {
        if (props.budget === null) {
            return;
        }

        fetch(`/api/budgets/${props.budget.id}/entries/tree?embed=category,account,currency`)
            .then(parseJSON)
            .then(checkApiError)
            .then((json: any) => {
                setIncomeEntries(json.income as BudgetEntryTreeNode);
                setExpenseEntries(json.expense as BudgetEntryTreeNode);
            });

    }, [props.budget])

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
        <Divider/>
        <Fragment>
            {incomeEntries != null && <BudgetEntries title={'income'} entries={incomeEntries} showEmpty={showEmpty}/>}
            {expenseEntries != null && <BudgetEntries title={'expense'} entries={expenseEntries} showEmpty={showEmpty}/>}
        </Fragment>
    </Fragment>;
}

export default BudgetPage;