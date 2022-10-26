import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DatePicker from 'react-date-picker';
import { ErrorMessage } from 'formik';
import { Formik, Form, Field } from 'formik';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { BudgetSelectorProps } from '../../containers/BudgetSelector';
import { ShortBudget } from '../../api/model';
import { FieldAttributes, useFormikContext } from 'formik';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as API from '../../api/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FormikDatePicker(props: FieldAttributes<any>) {
    const { setFieldValue } = useFormikContext();

    return (
        <DatePicker
            name={props.field.name}
            value={props.field.value}
            format="d/M/yyyy"
            onChange={v => setFieldValue(props.field.name, v)}
        />
    );
}

export function BudgetList(props: BudgetSelectorProps) {
    const [budgets, setBudgets] = useState<ShortBudget[]>([]);
    const [cursorNext, setCursorNext] = useState<string | undefined>(undefined);
    const [left, setLeft] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        (async () => {
            const result = await API.listBudgets(6); //Half a year
            setLoading(false);
            if (result.ok) {
                setBudgets(result.val.budgets);
                setCursorNext(result.val.next);
                setLeft(result.val.left);
            } else {
                props.reportError(result.val);
            }
        })();
    }, []);

    const onDeleteBudget = () => {
        setLoading(true);
        (async () => {
            const result = await API.deleteBudget(props.selectedBudgetId);
            setLoading(false);
            if (result.some) {
                setBudgets(budgets.filter(b => b.id !== props.selectedBudgetId));
                await props.loadCurrentBudget();
                if (budgets.length !== 0) {
                    await props.loadSelectedBudget(budgets[0].id);
                }
            }
        })();
    };
    const onCreateBudget = (values, form) => {
        setLoading(true);
        const newBudget = {
            id: -1,
            term_beginning: moment(values.begin).format('YYYY-MM-DD'),
            term_end: moment(values.end).format('YYYY-MM-DD'),
        };
        (async () => {
            const result = await API.saveBudget(newBudget);
            if (result.ok) {
                setBudgets([...budgets, result.val]);
                props.loadSelectedBudget(result.val.id);
            } else {
                props.reportError(result.val);
            }
            setLoading(false);
        })();
        form.resetForm();
    };

    const onBudgetSelect = (id: string | number) => {
        if (id === 'next' && cursorNext !== undefined && left !== undefined && left > 0) {
            (async () => {
                setLoading(true);
                const newBudgets = await API.loadBudgets(cursorNext);
                setLoading(false);
                if (newBudgets.ok) {
                    setLeft(newBudgets.val.left);
                    setCursorNext(newBudgets.val.next);
                    setBudgets(budgets.concat(newBudgets.val.budgets));
                }
            })();
        } else {
            props.loadSelectedBudget(id as number);
        }
    };
    const newBudgetValidate = values => {
        const errors = {};
        if (!values.begin || !values.end) {
            return errors;
        }

        const b = new Date(values.begin);
        const e = new Date(values.end);

        if (b > e) {
            errors['end'] = "Budget should begin before it's completion";
        } else {
            const oneDay = 24 * 60 * 60 * 1000;
            const days = Math.round((e.getTime() - b.getTime()) / oneDay);
            if (days < 1) {
                errors['end'] = 'Budget should be at least one full day long';
            }
        }

        budgets.forEach(budget => {
            const tb = new Date(budget.term_beginning);
            const te = new Date(budget.term_end);
            if (tb <= e && te >= b) {
                errors['begin'] = 'Budget is overlapping with existing budgets';
            }
        });
        return errors;
    };

    const budgetList = budgets.map((b: ShortBudget, index: number) => (
        <MenuItem key={index} value={b.id}>{`${b.term_beginning} - ${b.term_end}`}</MenuItem>
    ));
    if (left && left > 0) {
        budgetList.push(
            <MenuItem key="next" value="next">
                Load more budgets
            </MenuItem>
        );
    }

    const initialValues = {
        begin: moment().set({ date: 1 }).toDate(),
        end: moment().set({ date: 1 }).add(1, 'month').subtract(1, 'day').toDate(),
    };

    return (
        <Fragment>
            <Backdrop open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            Select budget:
            <Select
                disabled={budgets.length === 0}
                value={props.selectedBudgetId}
                onChange={ev => onBudgetSelect(ev.target.value)}>
                {budgetList}
            </Select>
            <Button color="primary" onClick={onDeleteBudget}>
                Delete selected budget
            </Button>
            <Formik initialValues={initialValues} validate={newBudgetValidate} onSubmit={onCreateBudget}>
                {({ submitForm, isSubmitting, values }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={4} lg={3}>
                                <Field
                                    type="text"
                                    name="begin"
                                    label="First budget day"
                                    value={values.begin}
                                    component={FormikDatePicker}
                                />
                                <ErrorMessage name="begin" component="div" />
                            </Grid>
                            <Grid item xs={4} lg={2}>
                                <Field
                                    type="text"
                                    name="end"
                                    label="Last budget day"
                                    value={values.end}
                                    component={FormikDatePicker}
                                />
                                <ErrorMessage name="end" component="div" />
                            </Grid>
                            <Grid item xs={4} lg={2}>
                                <Button color="primary" disabled={isSubmitting} onClick={submitForm}>
                                    Create budget
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Fragment>
    );
}

export default BudgetList;
