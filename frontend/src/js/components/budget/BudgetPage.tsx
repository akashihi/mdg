import React, { Fragment, useState, useEffect } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import { BudgetCategoryEntry, BudgetEntry } from './BudgetEntry';
import BudgetSelector from '../../containers/BudgetSelector';
import BudgetInfo from './BudgetInfo';
import { BudgetViewerProps } from '../../containers/BudgetViewer';
import { BudgetEntryTreeNode } from '../../models/Budget';
import { processApiResponse } from '../../util/ApiUtils';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { BudgetEntry as BudgetEntryType } from '../../models/Budget';

const cardStyle = {
    padding: '0px',
    paddingBottom: '16px',
};

const mapEntries = (tree: BudgetEntryTreeNode, indent: number, saveFunc: (BudgetEntryType) => void) => {
    const subCategories = tree.categories.flatMap(c => mapEntries(c, indent + 1, saveFunc));

    const entries = tree.entries.map(e => (
        <ListItemText key={e.id}>
            <BudgetEntry entry={e} indent={indent} save={saveFunc} />
        </ListItemText>
    ));
    if (tree.name !== undefined) {
        return [
            <ListItemText key={tree.id}>
                <BudgetCategoryEntry entry={tree} indent={indent} />
            </ListItemText>,
        ]
            .concat(entries)
            .concat(subCategories);
    }
    return entries.concat(subCategories);
};

function BudgetEntries(props: {
    entries: BudgetEntryTreeNode;
    title: string;
    saveFunc: (entry: BudgetEntryType) => void;
}) {
    return (
        <Card style={cardStyle}>
            <CardHeader
                style={{ paddingTop: '0px' }}
                title={props.title.charAt(0).toUpperCase() + props.title.slice(1)}
            />
            <CardContent>
                <List component="div" disablePadding>
                    {mapEntries(props.entries, 0, props.saveFunc)}
                </List>
            </CardContent>
        </Card>
    );
}

export function BudgetPage(props: BudgetViewerProps) {
    const [showEmpty, setShowEmpty] = useState<boolean>(false);
    const [incomeEntries, setIncomeEntries] = useState<BudgetEntryTreeNode | null>(null);
    const [expenseEntries, setExpenseEntries] = useState<BudgetEntryTreeNode | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const loadEntries = () => {
        if (props.budget === null) {
            return;
        }

        setLoading(true);

        let filter = 'nonzero';
        if (showEmpty) {
            filter = 'all';
        }
        fetch(`/api/budgets/${props.budget.id}/entries/tree?embed=category,account,currency&filter=${filter}`)
            .then(processApiResponse)
            .then(json => {
                setIncomeEntries(json.income as BudgetEntryTreeNode);
                setExpenseEntries(json.expense as BudgetEntryTreeNode);
                setLoading(false);
            });
    };

    useEffect(loadEntries, [props.budget, showEmpty]);

    const saveEntry = (entry: BudgetEntryType) => {
        setLoading(true);
        const url = `/api/budgets/${props.budget.id}/entries/${entry.id}`;
        const method = 'PUT';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/vnd.mdg+json;version=1',
            },
            body: JSON.stringify(entry),
        })
            .then(processApiResponse)
            .then(() => {
                loadEntries(); //Reload both trees to update categories sub-totals
            });
    };

    let emptyHiddenButton;
    if (showEmpty) {
        emptyHiddenButton = <Button onClick={() => setShowEmpty(false)}>Hide empty entries</Button>;
    } else {
        emptyHiddenButton = <Button onClick={() => setShowEmpty(true)}>Show empty entries</Button>;
    }
    return (
        <Fragment>
            <Backdrop open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <BudgetSelector />
            <Card>
                <CardActions>{emptyHiddenButton}</CardActions>
                <CardContent>
                    <BudgetInfo budget={props.budget} short={false} />
                </CardContent>
            </Card>
            <Divider />
            <Fragment>
                {incomeEntries != null && (
                    <BudgetEntries title={'income'} entries={incomeEntries} saveFunc={saveEntry} />
                )}
                {expenseEntries != null && (
                    <BudgetEntries title={'expense'} entries={expenseEntries} saveFunc={saveEntry} />
                )}
            </Fragment>
        </Fragment>
    );
}

export default BudgetPage;
