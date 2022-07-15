import React, { Fragment } from 'react'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import CircularProgress, {CircularProgressProps} from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import {Budget} from '../../models/Budget';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

export interface BudgetInfoProps {
    short: boolean,
    budget: Budget
}

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant='determinate' {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant='caption'
                    component='div'
                    color='text.secondary'
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export function BudgetInfo(props: BudgetInfoProps) {
    if (props.budget === null) {
        return <p>Budget data not available</p>;
    }

    const cardHeaderStyle = {
        paddingTop: '0px',
        textAlign: 'center'
    }

    const cardStyle = {
        padding: '0px',
        paddingBottom: '16px'
    }

    // That circular thingy needs to be moved, while rendering as overview widget
    let expensePercentageOffset;
    if (props.short) {
        expensePercentageOffset = 9;
    } else {
        expensePercentageOffset = 10;
    }

    let incomePercentage = 0;
    if (props.budget.state.income.expected !== 0) {
        incomePercentage = Math.round(props.budget.state.income.actual / props.budget.state.income.expected * 100);
    }
    let expensePercentage = 0;
    if (props.budget.state.expense.expected !== 0) {
        Math.round(props.budget.state.expense.actual / props.budget.state.expense.expected * 100);
    }

    const totalChange = props.budget.state.allowed.actual + props.budget.state.allowed.expected;
    let percentActualChange = 0;
    if (totalChange > 0) {
        percentActualChange = Math.round((props.budget.state.allowed.actual / totalChange) * 100);
    }

    const actualProfit = (props.budget.outgoing_amount.actual - props.budget.incoming_amount);
    const renderedActualProfit = (actualProfit <= 0 ? '' : '+') + actualProfit.toFixed(2);
    let expectedProfit = (props.budget.outgoing_amount.expected - props.budget.incoming_amount);
    const renderedExpectedProfit = (expectedProfit <= 0 ? '' : '+') + expectedProfit.toFixed(2)

    const title = `Budget for: ${props.budget.term_beginning}  - ${props.budget.term_end}`;

    return <Fragment>
        <CardHeader title={title} sx={cardHeaderStyle} />
        <CardContent style={cardStyle}>
            <Grid container spacing={2}>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <div>Assets first day: {props.budget.incoming_amount.toFixed(2)}</div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <div style={{ textAlign: 'center' }}>Actual assets last
                        day: {props.budget.outgoing_amount.actual.toFixed(2)} ({renderedActualProfit})
                    </div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <div style={{ textAlign: 'right' }}>Expected assets last
                        day: {props.budget.outgoing_amount.expected.toFixed(2)} ({renderedExpectedProfit})
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}><Divider variant='middle' /></Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <div>Income</div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <div style={{ textAlign: 'center' }}>Budget execution</div>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <div style={{ textAlign: 'right' }}>Expenses</div>
                </Grid>
                <Grid item xs={1}/>
                <Grid item xs={1}>
                    <CircularProgressWithLabel value={incomePercentage} size="80px"/>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1}/>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    Spent today: {props.budget.state.allowed.actual}
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <div style={{ textAlign: 'right' }}>Left today: {props.budget.state.allowed.expected}</div>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1}/>
                {!props.short && <Grid item xs={1} sm={1} md={1} lg={1}/>}
                <Grid item xs={1}>
                    <CircularProgressWithLabel variant='determinate' value={expensePercentage} size="80px" sx={{textAlign: 'right'}}/>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    {props.budget.state.income.actual} of {props.budget.state.income.expected}
                </Grid>
                <Grid item xs={5} sm={5} md={5} lg={5}>
                    <LinearProgress variant='determinate' value={percentActualChange} />
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={3}>
                    <div style={{textAlign:'right'}}>{props.budget.state.expense.actual} of {props.budget.state.expense.expected}</div>
                </Grid>
            </Grid>
        </CardContent>
    </Fragment>;
}

export default BudgetInfo;
