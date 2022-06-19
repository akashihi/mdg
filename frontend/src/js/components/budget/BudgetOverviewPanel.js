import React, { Component } from 'react';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import CircularProgressWithLabel  from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

export default class BudgetOverviewPanel extends Component {
  cardStyle = {
    padding: '0px',
    paddingBottom: '16px'
  }

  cardHeaderStyle = {
    paddingTop: '0px',
    textAlign: 'center'
  }

  render () {
    const props = this.props
    const budget = props.budget

    // That circular thingy needs to be moved, while rendering as overview widget
    let expensePercentageOffset;
    if (props.short) {
      expensePercentageOffset = 9
    } else {
      expensePercentageOffset = 10
    }

    const totalChange = budget.get('state').change.actual + budget.get('state').change.expected
    let percentActualChange
    if (totalChange > 0) {
      percentActualChange = Math.round((budget.get('state').change.actual / totalChange) * 100)
    }

    let incomePercentage
    if (budget.get('state').income.expected) {
      incomePercentage = Math.round(budget.get('state').income.actual / budget.get('state').income.expected * 100)
      if (incomePercentage > 100) {
        incomePercentage = 100
      }
    }

    let expensePercentage
    if (budget.get('state').expense.expected) {
      expensePercentage = Math.round(budget.get('state').expense.actual / budget.get('state').expense.expected * 100)
      if (expensePercentage > 100) {
        expensePercentage = 100
      }
    }

    let actualProfit = (budget.get('outgoing_amount').actual - budget.get('incoming_amount')).toFixed(2)
    actualProfit = (actualProfit <= 0 ? '' : '+') + actualProfit
    let expectedProfit = (budget.get('outgoing_amount').expected - budget.get('incoming_amount')).toFixed(2)
    expectedProfit = (expectedProfit <= 0 ? '' : '+') + expectedProfit

    const title = 'Budget for: ' + budget.get('term_beginning') + ' - ' + budget.get('term_end')

    return (
      <div>
        <CardHeader title={title} style={this.cardHeaderStyle} />
        <CardContent style={this.cardStyle}>
          <Grid  container spacing={2}>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <div>Assets first day: {budget.get('incoming_amount').toFixed(2)}</div>
              </Grid>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <div style={{ textAlign: 'center' }}>Actual assets last
                  day: {budget.get('outgoing_amount').actual.toFixed(2)} ({actualProfit})
                </div>
              </Grid>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <div style={{ textAlign: 'right' }}>Expected assets last
                  day: {budget.get('outgoing_amount').expected.toFixed(2)} ({expectedProfit})
                </div>
              </Grid>
            <Divider variant='middle' />
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <div>Income</div>
              </Grid>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <div style={{ textAlign: 'center' }}>Budget execution</div>
              </Grid>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <div style={{ textAlign: 'right' }}>Expenses</div>
              </Grid>
              <Grid item xs={1}>
                <div style={{ width: '80px', height: '80px' }}>
                  <CircularProgressWithLabel variant='determinate' value={incomePercentage} />
                </div>
              </Grid>
              <Grid item xsOffset={9} xs={1} lgOffset={expensePercentageOffset}>
                <div style={{ width: '80px', height: '80px', textAlign: 'right' }}>
                  <CircularProgressWithLabel variant='determinate' value={expensePercentage} />
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <div>{budget.get('state').income.actual} of {budget.get('state').income.expected}</div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <div style={{ textAlign: 'right' }}>{budget.get('state').expense.actual} of {budget.get('state').expense.expected}</div>
              </Grid>
              <Grid item xs={3} sm={2} md={2} lg={2}>
                Spent today: {budget.get('state').change.actual}
              </Grid>
              <Grid item xs={6} sm={8} md={8} lg={8}>
                <Progress percent={percentActualChange} />
              </Grid>
              <Grid item xs={3} sm={2} md={2} lg={2}>
                <div style={{ textAlign: 'right' }}>Left today: {budget.get('state').change.expected}</div>
              </Grid>
          </Grid>
        </CardContent>
      </div>
    )
  }
}
