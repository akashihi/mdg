import React from 'react'
import Grid from '@mui/material/Grid'

export default class TransactionShortWidget extends React.Component {
  render () {
    const props = this.props
    const transaction = props.transaction

    return (
      <Grid container spacing={2}>
        <Grid item xs={3} sm={2} md={1} lg={3}>{transaction.get('dt')}</Grid>
        <Grid item xs={6} sm={3} md={3} lg={3}>{transaction.get('comment')}</Grid>
        <Grid item xs={3} sm={1} md={1} lg={2}>
          <div style={{ color: transaction.get('totals').get('color') }}>{transaction.get('totals').get('total')}</div>
        </Grid>
        <Grid
          item
          xs={7} sm={3} md={2}
          lg={2}
        >{transaction.get('accountNames')}
        </Grid>
        <Grid item xs={1} sm={3} md={2} lg={2} className='hide-on-small'>{transaction.get('tags').join(', ')}</Grid>
      </Grid>
    )
  }
}
