import React, { Component, Fragment } from 'react'
import { withStyles } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import GridList from '@mui/material/GridList'
import GridListTile from '@mui/material/GridListTile'
import Transaction from './TransactionShortWidget'

const styles = {
  content: {
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  panel: {
    height: 300
  }
}

class TransactionsOverviewPanel extends Component {
  render () {
    const props = this.props

    const transactions = props.transactions.map((item, id) => {
      return <GridListTile key={id}><Transaction transaction={item} accounts={props.accounts} /></GridListTile>
    }).valueSeq()

    return (
      <>
        <CardHeader title='Last transactions' />
        <CardContent className={this.props.classes.content}>
          <GridList cellHeight={70} cols={1} className={this.props.classes.panel}>
            {transactions}
          </GridList>
        </CardContent>
      </>
    )
  }
}

export default withStyles(styles)(TransactionsOverviewPanel)
