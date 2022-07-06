import React, { Fragment, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Grid from '@mui/material/Grid'
import ClipLoader from 'react-spinners/ClipLoader'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

import Transaction from './TransactionFullWidget'
import TransactionPager from '../../containers/TransactionsPager'
import TransactionFilter from '../../containers/TransactionsFilter'
import TransactionDeleteDialog from '../../containers/TransactionDeleteDialog'

export function TransactionsPage(props) {
    const [expanded, setExpanded] = useState(false);
/*  state = { expanded: false }

  componentDidMount () {
    this.props.actions.loadTransactionList()
  }

  render () {
    const props = this.props

    const title = 'Showing transactions from ' + props.periodBeginning + ' till ' + props.periodEnd

    let summary = ''
    if (props.selectedTotals.get('count') > 0) {
      summary = (
        <ImageListItem>
          <Card>
            <CardContent style={{ textAlign: 'center' }}>Selected {props.selectedTotals.get('count')} transaction(s) with total change of {props.selectedTotals.get('change')}</CardContent>
          </Card>
        </ImageListItem>
      )
    }

    const transactions = props.transactions.map(function (item, id) {
      return (
        <ImageListItem key={id}><Transaction id={id} transaction={item} editAction={props.actions.editTransaction} deleteAction={props.actions.deleteTransactionRequest} selectTxAction={props.actions.markTransaction} /></ImageListItem>
      )
    }).valueSeq()*/

    /*return (
      <div>
        <TransactionDeleteDialog />
        <Card>
          <CardContent>
            {title}
          </CardContent>
        </Card>
        <Divider />
        <ImageList cols={1} cellHeight='auto'>
          {summary}
          <ImageListItem>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={1} />
                  <Grid item xs={1}>Date</Grid>
                  <Grid item xs={3}>Comment</Grid>
                  <Grid item xs={2}>Amount</Grid>
                  <Grid item xs={2}>Accounts</Grid>
                  <Grid item xs={2}>Tags</Grid>
                  <Grid item xs={1} />
                </Grid>
              </CardContent>
            </Card>
          </ImageListItem>
          {props.waiting && <ClipLoader sizeUnit='px' size={150} loading />}
          {props.error && <h1>Unable to load transactions list</h1>}
          {transactions}
        </ImageList>
        <TransactionPager />
      </div>
    )*/
  //}
    return <Fragment>
        <Card>
            <CardContent>
                title
                <IconButton onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-label='Show operations'>{!expanded && <ExpandMoreIcon/>}{expanded && <ExpandLessIcon/>}</IconButton>
            </CardContent>
            <CardContent>
                <Collapse in={expanded} timeout='auto' unmountOnExit>
                    <TransactionFilter/>
                </Collapse>
            </CardContent>
        </Card>
    </Fragment>
}

export default TransactionsPage;
