import React, {Fragment} from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import AccountsOverview from '../containers/AccountsOverview';
import BudgetOverview from '../containers/BudgetOverview';
import AssetOverview from '../containers/AssetOverview';
import TransactionsOverview from '../containers/TransactionsOverview';
import FinanceEvaluation from '../containers/FinanceEvaluation';
import {OverviewPageProps} from "../containers/OverviewPage";
import {OverviewPanels} from "../api/models/Setting";

export function Overview(props: OverviewPageProps): JSX.Element {
    const cardStyle = {
        height: 400,
        marginTop: 15,
    };

    const chooseWidget = (widgetName: OverviewPanels): JSX.Element => {
        return (
            <Fragment>
                {widgetName == "accounts" && <AccountsOverview/>}
                {widgetName == "finance" && <FinanceEvaluation/>}
                {widgetName == "asset" && <AssetOverview/>}
                {widgetName == "budget" && <BudgetOverview/>}
                {widgetName == "transactions" && <TransactionsOverview/>}
            </Fragment>
        )
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <Card style={cardStyle}>
                    {chooseWidget(props.overview.lt)}
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <Card style={cardStyle}>
                    {chooseWidget(props.overview.rt)}
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <Card style={cardStyle}>
                    {chooseWidget(props.overview.lb)}
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6}>
                <Card style={cardStyle}>
                    {chooseWidget(props.overview.rb)}
                </Card>
            </Grid>
        </Grid>
    );
}

export default Overview;
