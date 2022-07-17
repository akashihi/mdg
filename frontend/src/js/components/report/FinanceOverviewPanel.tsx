import React, { Fragment } from 'react';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import { FinanceOverviewPanelProps } from '../../containers/FinanceOverview';

export function FinanceOverviewPanel(props: FinanceOverviewPanelProps) {
    const items = props.totals.map((item, no) => {
        let color = 'black';
        if (item.primary_balance < 0) {
            color = 'red';
        }

        const details = item.amounts.map(a => `${a.amount} ${a.name}`).join(', ');

        return (
            <ListItem key={no} disablePadding>
                <Grid container spacing={1}>
                    <Grid item xs={2} sm={2} md={2} lg={2}>
                        <div style={{ textTransform: 'capitalize' }}>{item.category_name}:</div>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <span style={{ color }}>{item.primary_balance}</span> {props.primaryCurrency}
                    </Grid>
                    {details && (
                        <Grid item xs={7} sm={7} md={7} lg={7}>
                            ({details})
                        </Grid>
                    )}
                </Grid>
            </ListItem>
        );
    });
    return (
        <Fragment>
            <CardHeader
                title="Financial status"
                sx={{
                    paddingTop: '0px',
                    textAlign: 'center',
                }}
            />
            <CardContent
                sx={{
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}>
                <List sx={{ height: 300, width: '100%' }}>{items}</List>
            </CardContent>
        </Fragment>
    );
}

export default FinanceOverviewPanel;
