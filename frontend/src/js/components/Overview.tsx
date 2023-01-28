import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

/*import AccountsOverview from '../containers/AccountsOverview';*/
import BudgetOverview from '../containers/BudgetOverview';
import AssetOverview from '../containers/AssetOverview';
import TransactionsOverview from '../containers/TransactionsOverview';
import FinanceEvaluation from '../containers/FinanceEvaluation';

export function Overview() {
    const cardStyle = {
        height: 400,
        marginTop: 15,
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <Card style={cardStyle}>
                    <FinanceEvaluation />
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <Card style={cardStyle}>
                    <AssetOverview />
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <Card style={cardStyle}>
                    <BudgetOverview />
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <Card style={cardStyle}>
                    <TransactionsOverview />
                </Card>
            </Grid>
        </Grid>
    );
}

export default Overview;
