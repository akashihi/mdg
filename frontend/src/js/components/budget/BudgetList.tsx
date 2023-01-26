import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import MenuItem from '@mui/material/MenuItem';
import DatePicker from 'react-date-picker';
import { ErrorMessage } from 'formik';
import { Formik, Form, Field } from 'formik';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { BudgetOpsProps } from '../../containers/BudgetOps';
import { FieldAttributes, useFormikContext } from 'formik';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import Popper from '@mui/material/Popper';
import * as API from '../../api/api';
import BudgetSelectorTool from "../../containers/BudgetSelectorTool";

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

export function BudgetList(props: BudgetOpsProps) {
    const [currentlySelectedBudget, setCurrentlySelectedBudget] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [copyActionsMenuOpen, setCopyActionsMenuOpen] = React.useState<boolean>(false);
    const [copyActionSelected, setCopyActionSelected] = React.useState<number>(0);
    const [budgetOpsOpen, setBudgetOpsOpen] = React.useState<boolean>(false);

    const onCopyBudget = () => {
        if (currentlySelectedBudget != undefined) {
            setLoading(true);
            (async () => {
                const result = await API.copyBudget(
                    currentlySelectedBudget,
                    props.activeBudgetId,
                    copyActionSelected == 1
                );
                setLoading(false);
                if (result.some) {
                    await props.loadSelectedBudget(props.activeBudgetId);
                }
            })();
        }
    };

    const onDeleteBudget = () => {
        setLoading(true);
        props.deleteBudget(props.activeBudgetId);
        setLoading(false);
    };
    const onCreateBudget = (values, form) => {
        setLoading(true);
        const newBudget = {
            id: -1,
            term_beginning: moment(values.begin).format('YYYY-MM-DD'),
            term_end: moment(values.end).format('YYYY-MM-DD'),
        };
        props.createBudget(newBudget);
        setLoading(false);
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

        props.budgets.forEach(budget => {
            const tb = new Date(budget.term_beginning);
            const te = new Date(budget.term_end);
            if (tb <= e && te >= b) {
                errors['begin'] = 'Budget is overlapping with existing budgets';
            }
        });
        return errors;
    };

    const initialValues = {
        begin: moment().set({ date: 1 }).toDate(),
        end: moment().set({ date: 1 }).add(1, 'month').subtract(1, 'day').toDate(),
    };

    const copyActions = ['Copy to current budget', 'Copy to current budget (overwrite values)'];

    const handleCopyActionsClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setCopyActionsMenuOpen(false);
    };

    const handleCopyActionsToggle = () => {
        setCopyActionsMenuOpen(prevOpen => !prevOpen);
    };

    const handleCopyActionSelect = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        setCopyActionSelected(index);
        setCopyActionsMenuOpen(false);
    };

    const handleBudgetOpsToggle = () => {
        setBudgetOpsOpen(prevOpen => !prevOpen);
    };

    return (
        <Accordion expanded={budgetOpsOpen}>
            <AccordionSummary expandIcon={<ExpandMoreIcon onClick={handleBudgetOpsToggle} />}>
                <BudgetSelectorTool apply={props.loadSelectedBudget} onChange={setCurrentlySelectedBudget}/>
            </AccordionSummary>
            <AccordionDetails>
                <Fragment>
                    <Backdrop open={loading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={8}>
                            <Formik
                                initialValues={initialValues}
                                validate={newBudgetValidate}
                                onSubmit={onCreateBudget}>
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
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    disabled={isSubmitting}
                                                    onClick={submitForm}>
                                                    Create budget
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Form>
                                )}
                            </Formik>
                        </Grid>
                        <Grid item xs={6} md={4}>
                            <ButtonGroup variant="contained" ref={anchorRef}>
                                <Button onClick={onCopyBudget}>{copyActions[copyActionSelected]}</Button>
                                <Button size="small" onClick={handleCopyActionsToggle}>
                                    <ArrowDropDownIcon />
                                </Button>
                            </ButtonGroup>
                            <Popper
                                sx={{
                                    zIndex: 1,
                                }}
                                open={copyActionsMenuOpen}
                                anchorEl={anchorRef.current}
                                role={undefined}
                                disablePortal>
                                <Paper>
                                    <ClickAwayListener onClickAway={handleCopyActionsClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {copyActions.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    disabled={index === 2}
                                                    selected={index === copyActionSelected}
                                                    onClick={event => handleCopyActionSelect(event, index)}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Popper>
                            <Button color="error" variant="outlined" onClick={onDeleteBudget}>
                                Delete selected budget
                            </Button>
                        </Grid>
                    </Grid>
                </Fragment>
            </AccordionDetails>
        </Accordion>
    );
}

export default BudgetList;
