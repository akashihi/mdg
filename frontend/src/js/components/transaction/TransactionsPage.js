import React, { Component } from 'react'
import { withStyles } from '@mui/material/styles'
import classnames from 'classnames'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { Grid, Row, Col } from 'react-flexbox-grid'
import ClipLoader from 'react-spinners/ClipLoader'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import Transaction from './TransactionFullWidget'
import TransactionPager from '../../containers/TransactionsPager'
import TransactionFilter from '../../containers/TransactionsFilter'
import TransactionDeleteDialog from '../../containers/TransactionDeleteDialog'

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
})

class TransactionsPage extends Component {
  state = { expanded: false }

  componentDidMount () {
    this.props.actions.loadTransactionList()
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }))
  }

  render () {
    const { classes } = this.props
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
    }).valueSeq()

    return (
      <div>
        <TransactionDeleteDialog />
        <Card>
          <CardContent>
            {title}
            <IconButton className={classnames(classes.expand, { [classes.expandOpen]: this.state.expanded })} onClick={this.handleExpandClick} aria-expanded={this.state.expanded} aria-label='Show operations'>
              <ExpandMoreIcon />
            </IconButton>
          </CardContent>
          <CardContent>
            <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
              <TransactionFilter />
            </Collapse>
          </CardContent>
        </Card>
        <Divider />
        <ImageList cols={1} cellHeight='auto'>
          {summary}
          <ImageListItem>
            <Card>
              <CardContent>
                <Grid>
                  <Row>
                    <Col xs={1} />
                    <Col xs={1}>Date</Col>
                    <Col xs={3}>Comment</Col>
                    <Col xs={2}>Amount</Col>
                    <Col xs={2}>Accounts</Col>
                    <Col xs={2}>Tags</Col>
                    <Col xs={1} />
                  </Row>
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
    )
  }
}

export default withStyles(styles)(TransactionsPage)
