import React, { Fragment, useEffect, useState } from 'react';
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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import TransactionFilter from '../../containers/TransactionsFilter';
import TransactionDeleteDialog from './TransactionDeleteConfirmation';
import moment, { Moment } from 'moment';
import jQuery from 'jquery';
import { processApiResponse } from '../../util/ApiUtils';
import { EnrichedTransaction } from '../../models/Transaction';
import { enrichTransaction } from '../../selectors/TransactionSelector';
import { TransactionViewerProps } from '../../containers/TransactionsViewer';

export interface TransactionFilterParams {
    readonly notEarlier: Moment;
    readonly notLater: Moment;
    readonly comment: string | undefined;
    readonly account_id: number[];
    readonly tag: string[];
}

const defaultFilter: TransactionFilterParams = {
    notEarlier: moment().subtract(1, 'month'),
    notLater: moment(),
    comment: undefined,
    account_id: [],
    tag: [],
};
interface TransactionFullWidgetProps {
    tx: EnrichedTransaction;
    selectFunc: (selected: boolean, change: number) => void;
    editFunc: (tx: EnrichedTransaction) => void;
    deleteFunc: (tx: EnrichedTransaction) => void;
}

function TransactionFullWidget(props: TransactionFullWidgetProps) {
    const [expanded, setExpanded] = useState(false);

    const ops = props.tx.operations.map((o, number) => (
        <TableRow key={`${props.tx.id}-${number}`}>
            <TableCell sx={{ color: o.color }} align="left">
                {o.account ? o.account.name : ""}
            </TableCell>
            <TableCell sx={{ color: o.color }} align="right">
                {o.amount}
            </TableCell>
        </TableRow>
    ));

    return (
        <Fragment>
            <TableRow>
                <TableCell>
                    <Checkbox
                        color="default"
                        onChange={(_, value) => props.selectFunc(value, props.tx.summary.total)}
                    />
                </TableCell>
                <TableCell>{props.tx.dt}</TableCell>
                <TableCell>{props.tx.comment}</TableCell>
                <TableCell sx={{ color: props.tx.summary.color }}>{props.tx.summary.total}</TableCell>
                <TableCell>{props.tx.accountNames}</TableCell>
                <TableCell>{props.tx.tags ? props.tx.tags.join(',') : ""}</TableCell>
                <TableCell>
                    <IconButton aria-label="Edit" onClick={() => props.editFunc(props.tx)}>
                        <Edit />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => props.deleteFunc(props.tx)}>
                        <Delete />
                    </IconButton>
                    <IconButton
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        aria-label="Show operations">
                        {!expanded && <ExpandMoreIcon />}
                        {expanded && <ExpandLessIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                        <Table size="small" sx={{ width: 60 }}>
                            <TableBody>{ops}</TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export function TransactionsPage(props: TransactionViewerProps) {
    const [expanded, setExpanded] = useState(false);
    const [filter, setFilter] = useState<TransactionFilterParams>(defaultFilter);
    const [limit, setLimit] = useState(10);
    const [cursorNext, setCursorNext] = useState<string | undefined>(undefined);
    const [left, setLeft] = useState<number | undefined>(undefined);
    const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
    const [totalSelected, setTotalSelected] = useState<number>(0);
    const [noSelected, setNoSelected] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
    const [transactionToDelete, setTransactionToDelete] = useState<EnrichedTransaction | undefined>(undefined);

    const applyFilter = (f: TransactionFilterParams, l: number) => {
        setFilter(f);
        setLimit(l);
    };

    const updateSelection = (selected: boolean, change: number) => {
        if (selected) {
            setNoSelected(noSelected + 1);
            const totals = Math.round((totalSelected + change) * 1e2) / 1e2;
            setTotalSelected(totals);
        } else {
            setNoSelected(noSelected - 1);
            const totals = Math.round((totalSelected - change) * 1e2) / 1e2;
            setTotalSelected(totals);
        }
    };

    const confirmTransactionDeletion = (tx: EnrichedTransaction) => {
        setTransactionToDelete(tx);
        setDeleteVisible(true);
    };

    const closeDeleteDialog = () => {
        setDeleteVisible(false);
        setTransactionToDelete(undefined);
    };

    const deleteTransaction = (tx: EnrichedTransaction) => {
        closeDeleteDialog();
        setLoading(true);
        const url = `/api/transactions/${tx.id}`;

        fetch(url, { method: 'DELETE' }).then(function (response) {
            setLoading(false);
            if (response.status === 204) {
                setTransactions(transactions.filter(t => t.id !== tx.id));
            }
            props.loadAccountList();
            props.loadTotalsReport();
            props.loadCurrentBudget();
            if (props.currentBudgetId !== undefined) {
                props.loadSelectedBudget(props.currentBudgetId);
            }
        });
    };

    const loadTransactions = () => {
        setLoading(true);
        let query: object = {
            notEarlier: filter.notEarlier.format('YYYY-MM-DDT00:00:00'),
            notLater: filter.notLater.format('YYYY-MM-DDT23:59:59'),
        };
        if (filter.comment) {
            query = { ...query, comment: filter.comment };
        }
        if (filter.account_id.length !== 0) {
            query = { ...query, account_id: filter.account_id };
        }
        if (filter.tag.length !== 0) {
            query = { ...query, tag: filter.tag };
        }
        const params = Object.assign({}, { q: JSON.stringify(query) }, { limit: limit }, { embed: 'account' });

        const url = '/api/transactions' + '?' + jQuery.param(params);
        fetch(url)
            .then(processApiResponse)
            .then(function (json) {
                setLeft(json.left);
                setCursorNext(json.next);
                setTransactions(enrichTransaction(json.transactions));
                setLoading(false);
            });
    };

    useEffect(() => {
        loadTransactions();
    }, [filter, limit]);

    useEffect(() => {
        if (props.savableTransaction) {
            loadTransactions();
        }
    }, [props.savableTransaction]);

    const loadNextPage = () => {
        if (cursorNext) {
            // Do not load whole DB accidentally
            setLoading(true);
            const url = '/api/transactions' + '?' + jQuery.param({ cursor: cursorNext });
            fetch(url)
                .then(processApiResponse)
                .then(function (json) {
                    setLeft(json.left);
                    setCursorNext(json.next);
                    setTransactions(transactions.concat(enrichTransaction(json.transactions)));
                    setLoading(false);
                });
        }
    };

    const title = `Showing transactions from ${filter.notEarlier.format('DD-MM-YYYY')} till ${filter.notLater.format(
        'DD-MM-YYYY'
    )}`;
    return (
        <Fragment>
            <Backdrop open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <TransactionDeleteDialog
                tx={transactionToDelete}
                visible={deleteVisible}
                close={closeDeleteDialog}
                delete={deleteTransaction}
            />
            <Card>
                <CardContent>
                    {title}
                    <IconButton
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        aria-label="Show operations">
                        {!expanded && <ExpandMoreIcon />}
                        {expanded && <ExpandLessIcon />}
                    </IconButton>
                </CardContent>
                <CardContent>
                    <Collapse in={expanded} timeout="auto">
                        <TransactionFilter applyFunc={applyFilter} />
                    </Collapse>
                </CardContent>
            </Card>
            <Divider />
            {noSelected > 0 && (
                <Card>
                    <CardContent style={{ textAlign: 'center' }}>
                        Selected {noSelected} transaction(s) with total change of {totalSelected}
                    </CardContent>
                </Card>
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Date</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Accounts</TableCell>
                            <TableCell>Tags</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map(t => (
                            <TransactionFullWidget
                                key={t.id}
                                tx={t}
                                selectFunc={updateSelection}
                                deleteFunc={confirmTransactionDeletion}
                                editFunc={props.editTransaction}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {left && left > 0 && (
                <Link sx={{ justifyContent: 'center', display: 'flex' }} onClick={loadNextPage}>
                    Load next {limit < left ? limit : left} from remaining {left}
                </Link>
            )}
        </Fragment>
    );
}

export default TransactionsPage;
