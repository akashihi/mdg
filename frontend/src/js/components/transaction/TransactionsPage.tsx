import React, {Fragment, useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Grid from '@mui/material/Grid';
import ClipLoader from 'react-spinners/ClipLoader';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import Transaction from './TransactionFullWidget';
import TransactionFilter from '../../containers/TransactionsFilter';
import TransactionDeleteDialog from '../../containers/TransactionDeleteDialog';
import moment, {Moment} from 'moment';
import jQuery from 'jquery';
import {TransactionActionType} from '../../constants/Transaction';
import { checkApiError, parseJSON } from '../../util/ApiUtils';
import {EnrichedTransaction} from '../../models/Transaction';

export interface TransactionFilterParams {
    readonly notEarlier: Moment;
    readonly notLater: Moment;
    readonly comment: string|undefined;
    readonly account_id: number[];
    readonly tag: string[];
}

const defaultFilter: TransactionFilterParams = {
    notEarlier: moment().subtract(1, 'month'),
    notLater: moment(),
    comment: undefined,
    account_id: [],
    tag: []
}

export function TransactionsPage(props) {
    const [expanded, setExpanded] = useState(false);
    const [filter, setFilter] = useState<TransactionFilterParams>(defaultFilter);
    const [limit, setLimit] = useState(10);
    const [cursorNext, setCursorNext] = useState<string|undefined>(undefined);
    const [left, setLeft] = useState<number|undefined>(undefined);
    const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);

    const applyFilter = (f: TransactionFilterParams, l: number) => {
        setFilter(f);
        setLimit(l);
    }

    useEffect(() => {
        let query: object = {
            notEarlier: filter.notEarlier.format('YYYY-MM-DDT00:00:00'),
            notLater: filter.notLater.format('YYYY-MM-DDT23:59:59')
        }
        if (filter.comment) {
            query = {...query, comment: filter.comment};
        }
        if (filter.account_id.length !== 0) {
            query = {...query, account_id: filter.account_id};
        }
        if (filter.tag.length !== 0) {
            query = {...query, tag: filter.tag};
        }
        const params = Object.assign({}, {q: JSON.stringify(query)}, {limit: limit}, {embed: 'account'});

        const url = '/api/transactions' + '?' + jQuery.param(params)
        fetch(url)
            .then(parseJSON)
            .then(checkApiError)
            .then(function (json:any) {
                setLeft(json.left);
                setCursorNext(json.next);
                setTransactions(json.transactions)
            })
    }, [filter,limit]);

    const loadNextPage = () => {
        if (cursorNext) { // Not to load whole DB accidentally
            const url = '/api/transactions' + '?' + jQuery.param({cursor: cursorNext})
            fetch(url)
                .then(parseJSON)
                .then(checkApiError)
                .then(function (json:any) {
                    setLeft(json.left);
                    setCursorNext(json.next);
                    setTransactions(transactions.concat(json.transactions))
                })
        }
    }
/*

  render () {

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
      </div>
    )*/
  //}

    const title = `Showing transactions from ${filter.notEarlier.format('DD-MM-YYYY')} till ${filter.notLater.format('DD-MM-YYYY')}`
    return <Fragment>
        <Card>
            <CardContent>
                    {title}
                    <IconButton onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-label='Show operations'>{!expanded && <ExpandMoreIcon/>}{expanded && <ExpandLessIcon/>}</IconButton>
            </CardContent>
            <CardContent>
                <Collapse in={expanded} timeout='auto'>
                    <TransactionFilter applyFunc={applyFilter}/>
                </Collapse>
            </CardContent>
        </Card>
        <Divider />
        {left > 0 && <Link sx={{justifyContent: 'center', display: 'flex'}} onClick={loadNextPage}>Load next {limit<left ? limit : left} from remaining {left}</Link>}
    </Fragment>
}

export default TransactionsPage;
