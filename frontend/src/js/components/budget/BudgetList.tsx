import React, { Fragment, useState, useEffect } from 'react';
import { processApiResponse } from '../../util/ApiUtils';
import moment from 'moment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DatePicker from 'react-date-picker';
import { ErrorMessage } from 'formik';
import { Formik, Form, Field } from 'formik';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { BudgetSelectorProps } from '../../containers/BudgetSelector';
import { ShortBudget } from '../../models/Budget';
import { FieldAttributes, useFormikContext } from 'formik';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

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
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        fetch('/api/budgets')
            .then(processApiResponse)
            .then((json) => {
                setBudgets(json.budgets as ShortBudget[]);
                setLoading(false);
            });
    }, []);

    const onDeleteBudget = () => {
        setLoading(true);
        const url = `/api/budgets/${props.selectedBudgetId}`;
        fetch(url, { method: 'DELETE' }).then(response => {
            if (response.status === 204) {
                setBudgets(budgets.filter(b => b.id !== props.selectedBudgetId));
                props.loadCurrentBudget();
                if (budgets.length !== 0) {
                    props.loadSelectedBudget(budgets[0].id);
                }
                setLoading(false);
            }
        });
    };
    const onCreateBudget = (values, form) => {
        setLoading(true);
        const newBudget = {
            term_beginning: moment(values.begin).format('YYYY-MM-DD'),
            term_end: moment(values.end).format('YYYY-MM-DD'),
        };
        fetch('/api/budgets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.mdg+json;version=1',
            },
            body: JSON.stringify(newBudget),
        })
            .then(processApiResponse)
            .then((response) => {
                setBudgets([...budgets, response as ShortBudget]);
                props.loadSelectedBudget(response.id);
                setLoading(false);
            });
        form.resetForm();
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
                onChange={ev => props.loadSelectedBudget(ev.target.value)}>
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
