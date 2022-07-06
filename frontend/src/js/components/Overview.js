import React, { Component } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import AccountsOverview from '../containers/AccountsOverview'
//import BudgetOverview from '../containers/BudgetOverview'
import FinanceOverview from '../containers/FinanceOverview'
import TransactionsOverview from '../containers/TransactionsOverview'

export default class Overview extends Component {
  render () {
    const cardStyle = {
      height: 400,
      marginTop: 15
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card style={cardStyle}>
            <AccountsOverview />
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card style={cardStyle}>
              <FinanceOverview />
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card style={cardStyle}>
              {/*<BudgetOverview short />*/}
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Card style={cardStyle}>
              <TransactionsOverview />
          </Card>
        </Grid>
      </Grid>
    )
  }
}
