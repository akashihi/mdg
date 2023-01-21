import React, { useState, Fragment, useMemo } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CircularProgressWithLabel from '../../widgets/CircularProgressWithLabel';
import { BudgetEntry, BudgetEntryTreeNode } from '../../api/model';
import Divider from '@mui/material/Divider';
import ReactThreeToggle, { ReactThreeToggleProps } from 'react-three-toggle';
import DatePicker from 'react-date-picker';
import moment from "moment/moment";

export interface BudgetEntryProps {
    entry: BudgetEntry;
    indent: number;
    save: (BudgetEntry) => void;
    budget_start?: string;
    budget_end?: string;
}

function entryColor(progress: number, account_type: string): 'error' | 'warning' | 'success' {
    let color_progress = progress;
    if (account_type === 'INCOME') {
        color_progress = 1 / color_progress;
    }
    if (color_progress >= 95) {
        return 'error';
    } else if (color_progress >= 80) {
        return 'warning';
    } else {
        return 'success';
    }
}

export function BudgetCategoryEntry(props: { entry: BudgetEntryTreeNode; indent: number }) {
    let accountType = 'EXPENSE';
    if (props.entry.entries.length !== 0 && props.entry.entries[0].account) {
        accountType = props.entry.entries[0].account.account_type;
    }

    return (
        <div style={{ paddingBottom: '8px', fontStyle: 'italic', marginLeft: props.indent * 15 }}>
            <Grid container spacing={2}>
                <Grid item xs={3} sm={3} md={4} lg={3}>
                    <div>{props.entry.name}</div>
                </Grid>
                <Grid item xs={3} sm={3} md={2} lg={1}>
                    {accountType === 'EXPENSE' && props.entry.allowed_spendings > 0
                        ? `${props.entry.allowed_spendings} allowed`
                        : ''}
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={1}>
                    <div style={{ width: '60px', height: '60px' }}>
                        <CircularProgressWithLabel
                            variant="determinate"
                            value={props.entry.spending_percent}
                            color={entryColor(props.entry.spending_percent, accountType)}
                        />
                    </div>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <div style={{ textDecoration: 'underline' }}>{props.entry.expected_amount}</div>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={1}>
                    <div>{props.entry.actual_amount}</div>
                </Grid>
            </Grid>
            <Divider />
        </div>
    );
}

export function BudgetEntry(props: BudgetEntryProps) {
    const [expectedAmount, setExpectedAmount] = useState<number>(props.entry.expected_amount);

    const save = () => {
        const newEntry = { ...props.entry, expected_amount: expectedAmount };
        props.save(newEntry);
    };

    const applyExpectedAmount = (value: string) => {
        const amount = parseInt(value);
        if (isNaN(amount)) {
            setExpectedAmount(0);
        } else {
            setExpectedAmount(amount);
        }
    };

    const setDistribution = (value: ReactThreeToggleProps['values'][0]) => {
        if (typeof value != 'string') {
            if (props.entry.distribution != value.value) {
                const newEntry = { ...props.entry, distribution: value.value };
                props.save(newEntry);
            }
        }
    };

    const distributionModes = useMemo(
        () => [
            { label: 'Single', value: 'SINGLE' },
            { label: 'Even', value: 'EVEN' },
            { label: 'Prorated', value: 'PRORATED' },
        ],
        []
    );

    let editors = <div />;
    if (props.entry.account && props.entry.account.account_type === 'EXPENSE') {
        editors = (
            <Fragment>
                <Grid item xs={5} sm={5} md={6} lg={1} />
                <Grid item xs={3} sm={3} md={3} lg={1}>
                    <ReactThreeToggle
                        values={distributionModes}
                        initialValue={props.entry.distribution}
                        onChange={setDistribution}
                    />
                </Grid>
            </Fragment>
        );
    }

    const currency_name =
        props.entry.account && props.entry.account.currency ? `(${props.entry.account.currency.name})` : '';

    const dt = props.entry.dt == null ? null : moment(props.entry.dt).toDate();
    return (
        <div style={{ paddingBottom: '8px', marginLeft: props.indent * 15 + 10 }}>
            <Grid container spacing={2}>
                <Grid item xs={3} sm={3} md={4} lg={3}>
                    <div>
                        {props.entry.account ? props.entry.account.name : '???'}&nbsp;{currency_name})
                    </div>
                </Grid>
                <Grid item xs={3} sm={3} md={2} lg={1}>
                    {props.entry.account &&
                    props.entry.account.account_type === 'EXPENSE' &&
                    props.entry.allowed_spendings > 0
                        ? `${props.entry.allowed_spendings} allowed`
                        : ''}
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={1}>
                    <div style={{ width: '60px', height: '60px' }}>
                        <CircularProgressWithLabel
                            variant="determinate"
                            value={props.entry.spending_percent}
                            color={entryColor(
                                props.entry.spending_percent,
                                props.entry.account ? props.entry.account.account_type : 'EXPENSE'
                            )}
                        />
                    </div>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <TextField
                        id={'budgetentry' + props.entry.id}
                        value={expectedAmount}
                        type="number"
                        onBlur={save}
                        onChange={ev => applyExpectedAmount(ev.target.value)}
                    />
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={1}>
                    <div>{props.entry.actual_amount}</div>
                </Grid>
                <Grid item xs={3} sm={3} md={3} lg={1}>
                    <DatePicker format="d/M/yyyy" value={dt} disabled={props.entry.distribution != "SINGLE"} minDate={moment(props.budget_start).toDate()} maxDate={moment(props.budget_end).toDate()}/>
                </Grid>
                {editors}
            </Grid>
        </div>
    );
}
