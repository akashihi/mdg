import React, {useState} from 'react';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DatePicker from 'react-date-picker'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Done from '@mui/icons-material/Done';
import Clear from '@mui/icons-material/Clear';
import moment from 'moment';

import {accountMenu} from '../../util/AccountUtils'
import {TransactionFilterProps} from "../../containers/TransactionsFilter";
import {TransactionFilterParams} from "./TransactionsPage";

export function TransactionsPageFilter(props: TransactionFilterProps) {
    const [periodBeginning, setPeriodBeginning] = useState(moment().subtract(1, 'month'));
    const [periodEnd, setPeriodEnd] = useState(moment());
    const [pageSize, setPageSize] = useState(10);
    const [comment, setComment] = useState<string|undefined>(undefined);
    const [accounts, setAccounts] = useState<number[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const setPeriodDays = (days: number) => {
        setPeriodBeginning(moment().subtract(days, 'days'));
        setPeriodEnd(moment());
    }

    const clearFilter = () => {
        setPageSize(10);
        setComment(undefined);
        setAccounts([]);
        setTags([]);
    }

    const applyFilter = () => {
        const filter:TransactionFilterParams = {
            notEarlier: periodBeginning,
            notLater: periodEnd,
            comment: comment,
            account_id: accounts,
            tag: tags
        }
        props.applyFunc(filter, pageSize);
    }

    const buttonStyle = {
        'textDecorationLine': 'underline',
        'textDecorationStyle': 'dashed'
    };

    const tagItems = props.tags.map((tag) => {
        return <MenuItem key={tag} value={tag}>
            <Checkbox checked={tags.indexOf(tag) > -1}/>
            <ListItemText primary={tag}/>
        </MenuItem>
    });

    return <Grid container spacing={2} style={{'height': '340px'}}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
            Period beginning
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
            <DatePicker format='d/M/yyyy' value={periodBeginning.toDate()} onChange={(v) => {if (v!== null) {setPeriodBeginning(moment(v))} else {setPeriodBeginning(moment().subtract(1, 'month'))}}}/>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
            Period end
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
            <DatePicker format='d/M/yyyy' value={periodEnd.toDate()} onChange={(v) => {if (v!== null) {setPeriodEnd(moment(v))} else {setPeriodEnd(moment())}}}/>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
            <Button variant='text' sx={buttonStyle} onClick={() => setPeriodDays(0)}>Today</Button>
            <Button variant='text' sx={buttonStyle} onClick={() => setPeriodDays(7)}>Week</Button>
            <Button variant='text' sx={buttonStyle} onClick={() => setPeriodDays(30)}>Month</Button>
            <Button variant='text' sx={buttonStyle} onClick={() => setPeriodDays(90)}>Three months</Button>
            <Button variant='text' sx={buttonStyle} onClick={() => setPeriodDays(365)}>Year</Button>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
            <FormControl fullWidth={true}>
                <InputLabel htmlFor={'tx-on-page'}>Transactions on page</InputLabel>
                <Select value={pageSize}
                        onChange={(ev) => setPageSize(ev.target.value as number)}
                        inputProps={{id: 'tx-on-page'}}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={250}>250</MenuItem>
                    <MenuItem value={500}>500</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
            <FormControl fullWidth={true}>
                <TextField label='Comment contains...' onChange={(ev) => setComment(ev.target.value)} value={comment}/>
            </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
            <FormControl fullWidth={true}>
                <InputLabel htmlFor={'accounts-filter'}>Select accounts</InputLabel>
                <Select multiple={true}
                        value={accounts}
                        onChange={(ev) => setAccounts(ev.target.value as number[])}
                        inputProps={{id: 'accounts-filter'}}
                        renderValue={selected => selected.map((item) => props.accountNames[item]).join(';')}>
                    {accountMenu(props.assetTree, props.incomeTree, props.expenseTree)}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
            <FormControl fullWidth={true}>
                <InputLabel htmlFor={'tags-filter'}>Select tags</InputLabel>
                <Select multiple={true}
                        value={tags}
                        onChange={(ev) => setTags(ev.target.value as string[])}
                        inputProps={{id: 'tags-filter'}}
                        renderValue={selected => selected.join(',')}>
                    {tagItems}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={8} sm={8} md={8} lg={8}/>
        <Grid item xs={4} sm={4} md={4} lg={4}>
            <Button aria-label='Done' onClick={applyFilter}><Done/></Button>
            <Button aria-label='Clear' onClick={clearFilter}><Clear/></Button>
        </Grid>
    </Grid>
}

export default TransactionsPageFilter;
