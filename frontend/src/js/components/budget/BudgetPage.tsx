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
import { BudgetEntryTreeNode } from '../../api/models/Budget';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { BudgetEntry as BudgetEntryType } from '../../api/models/Budget';
import * as API from '../../api/api';

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

    useEffect(() => {
        props.loadCurrentBudget();
    }, []);

    const loadEntries = () => {
        const budget = props.budget;
        if (budget !== null && budget !== undefined) {
            setLoading(true);

            let filter = 'nonzero';
            if (showEmpty) {
                filter = 'all';
            }
            (async () => {
                const result = await API.loadBudgetEntries(budget.id, filter);
                if (result.ok) {
                    setIncomeEntries(result.val.income);
                    setExpenseEntries(result.val.expense);
                    setLoading(false);
                } else {
                    props.reportError(result.val);
                }
            })();
        }
    };

    useEffect(loadEntries, [props.budget, showEmpty]);

    const saveEntry = (entry: BudgetEntryType) => {
        const budget = props.budget; //Workaround over TS type coercion
        if (budget !== undefined) {
            //Don't try to save non-existent budgets
            setLoading(true);
            (async () => {
                const result = await API.saveBudgetEntry(entry, budget.id);
                if (result.ok) {
                    await loadEntries();
                } else {
                    props.reportError(result.val);
                }
            })();
        }
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
                    {props.budget ? (
                        <BudgetInfo budget={props.budget} short={false} />
                    ) : (
                        <p>Budget data not available</p>
                    )}
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
