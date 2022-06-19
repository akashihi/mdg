import React, { Component } from 'react'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Transaction from './TransactionShortWidget'

export default class TransactionsOverviewPanel extends Component {
  render () {
    const props = this.props

    const transactions = props.transactions.map((item, id) => {
      return <ImageListItem key={id}><Transaction transaction={item} accounts={props.accounts} /></ImageListItem>
    }).valueSeq()

    return (
      <>
        <CardHeader title='Last transactions' />
        <CardContent sx={{
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
        >
          <ImageList
            cellHeight={70} cols={1} sx={{
              height: 300
            }}
          >
            {transactions}
          </ImageList>
        </CardContent>
      </>
    )
  }
}
