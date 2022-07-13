import React, {Fragment, useState, useEffect} from 'react';
import {evaluate} from 'mathjs';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import moment from 'moment';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DatePicker from 'react-date-picker'
import TimePicker from 'react-time-picker';
import Checkbox from '@mui/material/Checkbox';
import RSelect from 'react-select';
import {produce} from 'immer';

import {TransactionDialogProps} from "../../containers/TransactionEditor";
import {Operation, Transaction} from "../../models/Transaction";
import {
    validateAccountSelected,
    validateOperationAmount,
    validateRate,
    validateTransaction
} from "../../util/TransactionValidation";
import {accountMenu} from "../../util/AccountUtils";

interface OperationsEditorProps {
    operations: Operation[],
    accounts: ReturnType<typeof accountMenu>,
    limitedAccounts: ReturnType<typeof accountMenu>,
    setOperationsFunc: (ops: Operation[]) => void;
}

function evaluateEquation(value:string):string {
    if (value) {
        const strAmount = value.toString();
        if (strAmount.slice(-1) === '=') { //If it ends with =
            let expr = strAmount.slice(0, -1); //Strip the = and evaluate mathematical expression
            try {
                value = evaluate(expr);
            } catch (e) {
                value = expr;
            }
        }
    }
    return value;
}

function SimpleOperationsEditor(props: OperationsEditorProps) {
    const [amount, setAmount] = useState<string>(String(props.operations[1].amount));
    useEffect(() => { setAmount(String(props.operations[1].amount))}, [props]);

    let amountValidity = validateOperationAmount(amount);
    let leftValidity = validateAccountSelected(props.operations[0].account_id);
    let rightValidity = validateAccountSelected(props.operations[1].account_id);

    const setLeftAccount = (id: number) => {
        leftValidity = validateAccountSelected(id);
        props.setOperationsFunc([{...props.operations[0], account_id: id}, props.operations[1]]);
    }

    const setRightAccount = (id: number) => {
        rightValidity = validateAccountSelected(id);
        props.setOperationsFunc([props.operations[0], {...props.operations[1], account_id: id}]);
    }

    const applyAmount = (value: string) => {
        const evaluated = evaluateEquation(value);
        amountValidity = validateOperationAmount(value);
        setAmount(String(evaluated));
        if (amountValidity === null) {
            if (!evaluated.endsWith('0')) { // Trailing zero means that user is typing, but it's not an error
                const amount = parseFloat(evaluated);
                props.setOperationsFunc([{...props.operations[0], amount: -1*amount}, {...props.operations[1], amount: amount}]);
            }
        }
    }

    return <Grid container spacing={2} sx={{marginTop: "10px"}}>
        <Grid item xs={5} sm={5} md={5} lg={4}>
            <FormControl error={leftValidity !== null} fullWidth={true}>
                <InputLabel htmlFor={'source-simple'}>{leftValidity !== null? leftValidity : 'Source'}</InputLabel>
                <Select value={props.operations[0].account_id}
                        onChange={(ev) => setLeftAccount(ev.target.value as number)}
                        inputProps={{id: 'source-simple'}}>
                    {props.accounts}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={1}/>
        <Grid item xs={2} sm={2} md={2} lg={2}>
            <TextField label={amountValidity !== null ? amountValidity : 'Amount'} error={amountValidity !== null}
                       value={amount} onChange={(ev)=>applyAmount(ev.target.value as string)}/>
        </Grid>
        <Grid item xs={1}/>
        <Grid item xs={5} sm={5} md={5} lg={4}>
            <FormControl error={rightValidity !== null} fullWidth={true}>
                <InputLabel htmlFor={'destination-simple'}>{rightValidity !== null ? rightValidity : 'Destination'}</InputLabel>
                <Select value={props.operations[1].account_id}
                        onChange={(ev) => setRightAccount(ev.target.value as number)}
                        inputProps={{id: 'destination-simple'}}>
                    {props.limitedAccounts}
                </Select>
            </FormControl>
        </Grid>
    </Grid>
}


interface OperationsFullEditorProps  extends OperationsEditorProps {
    accountCurrencies: Record<number, number>;
    primaryCurrencyId: number
}

function FullOperationsEditor(props: OperationsFullEditorProps) {
    const [amounts, setAmounts] = useState<string[]>(props.operations.map(o => String(o.amount)));
    const [rates, setRates] = useState<string[]>(props.operations.map(o => String(o.rate)));
    useEffect(() => {
        setAmounts(props.operations.map(o => String(o.amount)));
        setRates(props.operations.map(o => String(o.rate)));
    }, [props]);


    const checkRateDisabled = (op: Operation):boolean => {
        // First check - if we only have ops in same currency, rate should be definitely disabled.
        const usedCurrencies = props.operations.map(o => props.accountCurrencies[o.account_id]).filter((currency, index, self) => self.indexOf(currency) === index);
        if (usedCurrencies.length <= 1) {
            return true;
        }

        //Second check - in case our currency is the primary currency
        if (props.accountCurrencies[op.account_id] === props.primaryCurrencyId) {
            return true;
        }

        //Third check - in case we don't have any op with primary currency
        //we should disable rate for all ops, having same currency as the first
        //op of the transaction
        const nonPrimary = props.operations.map(o => props.accountCurrencies[o.account_id]).filter(currency => currency === props.primaryCurrencyId);
        if (nonPrimary.length === 0) {
            //Ok, we do not have primary currency at the transaction
            return props.accountCurrencies[props.operations[0].account_id] === props.accountCurrencies[op.account_id];
        }
        return false;
    }

    const applyAccount = (index:number, account_id: number) => {
        props.setOperationsFunc(produce((draft:Operation[]) => {draft[index].account_id = account_id})(props.operations));
    }

    const applyRate = (index:number, rate: string) => {
        const evaluated = evaluateEquation(rate);
        setRates(produce((draft:string[]) => {draft[index]=evaluated})(rates));
        if (validateRate(rate) === null) {
            if (!evaluated.endsWith('0')) { // Trailing zero means that user is typing, but it's not an error
                const parsed = parseFloat(evaluated);
                props.setOperationsFunc(produce((draft:Operation[]) => {draft[index].rate = parsed})(props.operations));
            }
        }

    }

    const applyAmount = (index:number, amount: string) => {
        const evaluated = evaluateEquation(amount);
        setAmounts(produce((draft:string[]) => {draft[index]=evaluated})(amounts));
        if (validateOperationAmount(amount) === null) {
            if (!evaluated.endsWith('0')) { // Trailing zero means that user is typing, but it's not an error
                const parsed = parseFloat(evaluated);
                props.setOperationsFunc(produce((draft:Operation[]) => {draft[index].amount = parsed})(props.operations));
            }
        }
    }

    const addOp = () => {
        props.setOperationsFunc([...props.operations, {account_id:-1, amount:0, rate: 1}]);
    }

    const ops = props.operations.map((op,index) => {
        let amountValidity = validateOperationAmount(amounts[index]);
        let accountValidity = validateAccountSelected(op.account_id);
        let rateValidity = validateRate(rates[index]);

        return <Grid  container spacing={2}  key={'op'+index} style={{marginTop: "5px"}}>
            <Grid item xs={4} sm={4} md={4} lg={4}>
                <TextField label={amountValidity !== null?amountValidity : 'Amount'} error={amountValidity !== null} value={amounts[index]}
                           onChange={(ev) => applyAmount(index, ev.target.value)}/>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}>
                <TextField label={rateValidity !== null? rateValidity : 'Rate'} error={rateValidity !== null} value={rates[index]}
                           onChange={(ev) => applyRate(index, ev.target.value)}
                           disabled={checkRateDisabled(op)}/>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4}>
                <FormControl error={accountValidity !== null} fullWidth={true}>
                    <InputLabel htmlFor={'destination-simple'}>{accountValidity !== null? accountValidity : 'Account'}</InputLabel>
                    <Select value={op.account_id}
                            onChange={(ev) => applyAccount(index, ev.target.value as number)}
                            inputProps={{id: 'destination-simple'}}>
                        {props.accounts}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    });
    return <Fragment>
        {ops}
        <Grid  container spacing={2}>
            <Grid item xs={5} sm={5} md={5} lg={5}/>
            <Grid item xs={1} sm={1} md={1} lg={1}>
                <IconButton onClick={addOp}><PlaylistAdd/></IconButton>
            </Grid>
        </Grid>
    </Fragment>
}

export function TransactionDialog(props: TransactionDialogProps) {
    const [autoClose, setAutoClose] = useState(props.closeOnExit);
    const [tx, setTx] = useState(props.transaction);
    const [activeTab, setActiveTab] = useState('simple');
    const [transactionValidity, setTransactionValidity] = useState<string|null>(null);

    const validationErrorStyle = {
        'position': 'relative',
        'bottom': '-2px',
        'fontSize': '12px',
        'lineHeight': '12px',
        'color': 'rgb(244, 67, 54)',
        'transition': 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
    } as React.CSSProperties;

    useEffect(() => {
        setTx(props.transaction);

        if (validForSimpleEditing(props.transaction)) {
            setActiveTab('simple');
        } else {
            setActiveTab('multi');
        }
    }, [props]);

    useEffect(() => {
        setAutoClose(props.closeOnExit);
    }, [props.closeOnExit]);

    useEffect(() => {
        const globalValidity = validateTransaction(tx);
        if (globalValidity !== null) {
            setTransactionValidity(globalValidity);
            return;
        }
        if (tx.operations.map(o => validateAccountSelected(o.account_id)).some(e => e !== null)) {
            setTransactionValidity("");
            return;
        }
        if (tx.operations.map(o => validateOperationAmount(o.amount)).some(e => e !== null)) {
            setTransactionValidity("");
            return;
        }
        if (tx.operations.map(o => validateRate(o.rate)).some(e => e !== null)) {
            setTransactionValidity("");
            return;
        }
        setTransactionValidity(null);
    }, [tx]);

    const switchTab = (_, value: string) => {
        if (!validForSimpleEditing(tx)) {
            value = 'multi'
        }
        setActiveTab(value);
    }

    const setDate = (date: Date | null) => {
        let newDate = moment();
        if (date !== null) {
            newDate = moment(date);
            const dt = moment(props.transaction.timestamp);
            newDate.set({
                hour: dt.get('hour'),
                minute: dt.get('minute'),
                second: dt.get('second')
            })
        }
        setTx(produce((draft: Transaction) => {
            draft.timestamp = newDate.format('YYYY-MM-DDTHH:mm:ss')
        })(tx));
    }
    const setTime = (time: Date | null) => {
        let newTime = moment();
        const dt = moment(props.transaction.timestamp);
        if (time !== null) {
            newTime = moment(time, 'HH:mm');
            dt.set({
                hour: newTime.get('hour'),
                minute: newTime.get('minute'),
                second: newTime.get('second')
            })
        }
        setTx(produce((draft: Transaction) => {
            draft.timestamp = dt.format('YYYY-MM-DDTHH:mm:ss')
        })(tx));
    }
    const setTags = (value: { label: string, value: string }[]) => {
        const tags = value.map(item => item.value);
        setTx(produce((draft: Transaction) => {
            draft.tags = tags
        })(tx));
    }

    const setOperations = (ops: Operation[]) => {setTx(produce((draft: Transaction) => {draft.operations = ops})(tx))}

    const save = () => {
        props.updateTransaction(tx);
        if (autoClose) {
            props.closeTransactionDialog();
        }
    }

    const validForSimpleEditing = (transaction: Transaction): boolean => {
        if (transaction.operations.length > 2) { //Too many operations
            return false
        }
        if (transaction.operations.length < 2) { //Not all ops are set, should be safe for simple editing
            return true
        }

        return props.accountCurrencies[transaction.operations[0].account_id] === props.accountCurrencies[transaction.operations[1].account_id]
    }

    const tags = props.tags.map((item) => {
        return {label: item, value: item}
    });
    let selectedTags = [];
    if (tx.tags !== undefined) {
        selectedTags = tx.tags.map((item) => {
            return {label: item, value: item}
        });
    }

    const accounts = accountMenu(props.assetTree, props.incomeTree, props.expenseTree);
    const limitedAccounts = accountMenu(props.assetTree, props.incomeTree, props.expenseTree, props.accountCurrencies[tx.operations[0].account_id]);

    return <Dialog title='Transaction editing' open={props.visible} scroll={'paper'} maxWidth={'md'} fullWidth={true}
                   onClose={props.closeTransactionDialog}>
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <DatePicker format='d/M/yyyy' value={moment(tx.timestamp).toDate()} onChange={setDate}/>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <TimePicker value={moment(tx.timestamp).toDate()} onChange={setTime}/>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <RSelect options={tags} isMulti={true} onChange={setTags} value={selectedTags}/>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField label='Comment on transaction' fullWidth={true} multiline={true} rows={4}
                               value={tx.comment} variant='outlined'
                               onChange={(ev) => setTx(produce((draft: Transaction) => {
                                   draft.comment = ev.target.value
                               })(tx))}/>
                </Grid>
            </Grid>
            <Divider/>
            <Tabs value={activeTab} onChange={switchTab}>
                <Tab label='Simple' value='simple' disabled={!validForSimpleEditing(tx)}/>
                <Tab label='Multiple operations' value='multi'/>
            </Tabs>
            {activeTab === 'simple' && <SimpleOperationsEditor operations={tx.operations} accounts={accounts} limitedAccounts={limitedAccounts} setOperationsFunc={setOperations}/>}
            {activeTab === 'multi' && <FullOperationsEditor operations={tx.operations} accounts={accounts} limitedAccounts={limitedAccounts} accountCurrencies={props.accountCurrencies} primaryCurrencyId={props.primaryCurrencyId} setOperationsFunc={setOperations}/>}
            <Grid  container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div style={validationErrorStyle}>{transactionValidity}</div>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <InputLabel htmlFor={'close-dialog'}>Close dialog on save</InputLabel>
            <Checkbox checked={autoClose} inputProps={{id: 'close-dialog'}}
                      onChange={(ev, value) => setAutoClose(value)}/>
            <Button color='primary' disabled={transactionValidity !== null} onClick={save}>Save</Button>
            <Button color='secondary' onClick={props.closeTransactionDialog}>Cancel</Button>
        </DialogActions>
    </Dialog>
}

export default TransactionDialog;
