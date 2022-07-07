import React, {Fragment, useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';

import TransactionFilter from '../../containers/TransactionsFilter';
import TransactionDeleteDialog from '../../containers/TransactionDeleteDialog';
import moment, {Moment} from 'moment';
import jQuery from 'jquery';
import { checkApiError, parseJSON } from '../../util/ApiUtils';
import {EnrichedTransaction} from '../../models/Transaction';
import {enrichTransaction} from "../../selectors/TransactionSelector";

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

function TransactionFullWidget(props: EnrichedTransaction) {
    const [expanded, setExpanded] = useState(false);
    /*

    markTransaction = value => {
        const props = this.props;
        props.selectTxAction(props.transaction.get('id'), value)
    };

    }*/
    const ops = props.operations.map((o, number) => <TableRow key={`${props.id}-${number}`}>
        <TableCell sx={{ color: o.color }} align='left'>{o.account.name}</TableCell>
        <TableCell sx={{ color: o.color }} align='right'>{o.amount}</TableCell>
    </TableRow>)

    return <Fragment>
        <TableRow>
            <TableCell><Checkbox color='default' /*onChange={(ev, value) => ::this.markTransaction(value)}*//></TableCell>
            <TableCell>{props.dt}</TableCell>
            <TableCell>{props.comment}</TableCell>
            <TableCell sx={{color: props.summary.color}}>{props.summary.total}</TableCell>
            <TableCell>{props.accountNames}</TableCell>
            <TableCell>{props.tags.join(',')}</TableCell>
            <TableCell>
                <IconButton aria-label='Edit' /*onClick={() => props.editAction(props.id, props.transaction)}*/><Edit/></IconButton>
                <IconButton aria-label='Delete' /*onClick={() => props.deleteAction(props.id)}*/><Delete/></IconButton>
                <IconButton onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-label='Show operations'>{!expanded && <ExpandMoreIcon/>}{expanded && <ExpandLessIcon/>}</IconButton>
            </TableCell>
        </TableRow>
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                <Collapse in={expanded} timeout="auto" unmountOnExit sx={{width: "100%"}}>
                    <Table size="small" sx={{width: 60}}>
                        <TableBody>
                            {ops}
                        </TableBody>
                    </Table>
                </Collapse>
            </TableCell>
        </TableRow>
    </Fragment>
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
                setTransactions(enrichTransaction(json.transactions))
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
                    setTransactions(transactions.concat(enrichTransaction(json.transactions)))
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
          {summary}
          {props.waiting && <ClipLoader sizeUnit='px' size={150} loading />}
          {props.error && <h1>Unable to load transactions list</h1>}
          {transactions}
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
        <TableContainer component={Paper}>

        </TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell/>
                    <TableCell>Date</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Accounts</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell/>
                </TableRow>
            </TableHead>
            <TableBody>
                {transactions.map(t => <TransactionFullWidget key={t.id} {...t}/>)}
            </TableBody>
        </Table>
        {left > 0 && <Link sx={{justifyContent: 'center', display: 'flex'}} onClick={loadNextPage}>Load next {limit<left ? limit : left} from remaining {left}</Link>}
    </Fragment>
}

export default TransactionsPage;
