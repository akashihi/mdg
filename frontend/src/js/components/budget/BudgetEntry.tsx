import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CircularProgressWithLabel  from '../../widgets/CircularProgressWithLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {BudgetEntry, BudgetEntryTreeNode} from "../../models/Budget";
import Divider from '@mui/material/Divider';

export interface BudgetEntryProps {
    entry: BudgetEntry,
    indent: number,
    save: (BudgetEntry) => void
}

function entryColor(progress: number, account_type: string):"error"|"warning"|"success" {
    let color_progress = progress;
    if (account_type === 'INCOME') {
        color_progress = 1/color_progress;
    }
    if (color_progress >= 95) {
        return 'error';
    } else if (color_progress >= 80) {
        return 'warning';
    } else {
        return 'success';
    }
}

export function BudgetCategoryEntry(props: {entry: BudgetEntryTreeNode, indent: number}) {
    let accountType = 'EXPENSE';
    if (props.entry.entries.length !== 0) {
       accountType = props.entry.entries[0].account.account_type;
    }

    return <div style={{paddingBottom:'8px', fontStyle: 'italic', marginLeft: props.indent*15}}>
        <Grid container spacing={2}>
            <Grid item xs={3} sm={3} md={4} lg={3}>
                <div>{props.entry.name}</div>
            </Grid>
            <Grid item xs={3} sm={3} md={2} lg={1}>
                {props.entry.allowed_spendings > 0 ? `${props.entry.allowed_spendings} allowed` : ""}
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={1}>
                <div style={{width: '60px', height: '60px'}}>
                    <CircularProgressWithLabel variant='determinate' value={props.entry.spending_percent} color={entryColor(props.entry.spending_percent, accountType)}/>
                </div>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
                <div style={{textDecoration: "underline"}}>{props.entry.expected_amount}</div>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={1}>
                <div>{props.entry.actual_amount}</div>
            </Grid>
        </Grid>
        <Divider/>
    </div>
}

export function BudgetEntry(props: BudgetEntryProps) {
    const [expectedAmount, setExpectedAmount] = useState<number>(props.entry.expected_amount);

    const save = () => {
        const newEntry = {...props.entry, expected_amount: expectedAmount};
        props.save(newEntry);
    }
    /*
    render() {
        const props = this.props;
        const entry = this.state.entry;

        if (entry.get('loading')) {
            // Fast processing
            return <ClipLoader sizeUnit={'px'} size={15} loading={true}/>
        }


        let progress = 0;
        if (entry.get('expected_amount') !== 0) {
            progress = Math.round(entry.get('actual_amount') / entry.get('expected_amount') * 100);
            if (progress > 100) {
                progress = 100
            }
        } else if (entry.get('actual_amount') > 0) {
            progress = 100
        }

        let change = <div/>;
        let editors = <div/>;
        if (entry.get('account_type') === 'expense') {
            editors = (
                <Fragment>
                    <Grid item xsOffset={5} xs={3} smOffset={5} sm={3} mdOffset={6} md={3} lgOffset={1} lg={1}>
                        <FormControlLabel control={<Checkbox color='primary' checked={entry.get('even_distribution')} onChange={(ev, value) => ::this.onEdit('even_distribution', value, true)}/>} label={'Evenly distributed'}/>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={1}>
                        <FormControlLabel control={<Checkbox color='primary' checked={entry.get('proration')} onChange={(ev, value) => ::this.onEdit('proration', value, true)} disabled={!entry.get('even_distribution')}/>} label={'Prorate spendings'}/>
                    </Grid>
                </Fragment>
            );
            if (entry.get('change_amount')) {
                change = <div>{entry.get('change_amount')} allowed</div>;
            }
        }

    }*/

    return <div style={{paddingBottom:'8px', marginLeft: props.indent*15+10}}>
        <Grid container spacing={2}>
            <Grid item xs={3} sm={3} md={4} lg={3}>
                <div>{props.entry.account.name}&nbsp;({props.entry.account.currency.name})</div>
            </Grid>
            <Grid item xs={3} sm={3} md={2} lg={1}>
                {props.entry.allowed_spendings > 0 ? `${props.entry.allowed_spendings} allowed` : ""}
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={1}>
                <div style={{width: '60px', height: '60px'}}>
                    <CircularProgressWithLabel variant='determinate' value={props.entry.spending_percent} color={entryColor(props.entry.spending_percent, props.entry.account.account_type)}/>
                </div>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
                <TextField id={'budgetentry' + props.entry.id} value={expectedAmount} type='number' onBlur={save} onChange={(ev) => setExpectedAmount(parseInt(ev.target.value))}/>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={1}>
                <div>{props.entry.actual_amount}</div>
            </Grid>
            {/*editors*/}
        </Grid>
    </div>
}
