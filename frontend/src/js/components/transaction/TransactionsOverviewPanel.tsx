import React, { Fragment, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { TransactionOverviewProps } from '../../containers/TransactionsOverview';
import { EnrichedTransaction } from '../../api/models/Transaction';
import Grid from '@mui/material/Grid';

function TransactionShortWidget(props: EnrichedTransaction) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={3} sm={2} md={1} lg={3}>
                {props.timestamp}
            </Grid>
            <Grid item xs={6} sm={3} md={3} lg={3}>
                {props.comment}
            </Grid>
            <Grid item xs={3} sm={1} md={1} lg={2}>
                <div style={{ color: props.summary.color }}>{props.summary.total}</div>
            </Grid>
            <Grid item xs={7} sm={3} md={2} lg={2}>
                {props.accountNames}
            </Grid>
            <Grid item xs={1} sm={3} md={2} lg={2} className="hide-on-small">
                {props.tags? props.tags.join(', ') : ""}
            </Grid>
        </Grid>
    );
}

export function TransactionsOverviewPanel(props: TransactionOverviewProps) {
    useEffect(() => {
        props.loadLastTransactions();
    }, []);
    const transactions = props.transactions.map((item, id) => (
        <ListItem key={id}>
            <TransactionShortWidget {...item} />
        </ListItem>
    ));

    return (
        <Fragment>
            <CardHeader title="Last transactions" />
            <CardContent
                sx={{
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}>
                <List disablePadding sx={{ height: 300 }}>
                    {transactions}
                </List>
            </CardContent>
        </Fragment>
    );
}

export default TransactionsOverviewPanel;
