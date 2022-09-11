import React, {useEffect, useState} from 'react';
import { produce } from 'immer';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TextField, Switch } from 'formik-mui';
import MenuItem from '@mui/material/MenuItem';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AccountDialogProps } from '../../containers/AccountEditor';
import { mapCategoryListToMenu } from '../../util/CategoryUtils';
import { Account } from '../../models/Account';
import {processApiResponse} from "../../util/ApiUtils";

function AccountDialog(props: AccountDialogProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [deletable, setDeletable] = useState<boolean>(false);

    useEffect(() => {
        const url = `/api/accounts/${props.account.id}/status`;

        setLoading(true);
        fetch(url)
            .then(processApiResponse)
            .then((data) => {
                setDeletable(data.deletable)
                setLoading(false);
            });
    }, [props.account.id]);

    const onSubmit = (values: Account) => {
        props.close();

        if (values.category_id === -1) {
            // We use -1 as a fake default value to make MUI happy
            // mdg have no idea on that
            values = produce(draft => (draft.category_id = undefined))(values);
        }

        props.updateAccount(values);
    };

    const currencies = props.currencies.map(c => (
        <MenuItem value={c.id} key={c.id}>
            {c.name}
        </MenuItem>
    ));

    const initialValues: Partial<Account> = {
        id: props.account.id,
        account_type: props.account.account_type,
        name: props.account.name,
        currency_id: props.account.currency_id,
        category_id: props.account.category_id ? props.account.category_id : -1,
        favorite: props.account.favorite,
        operational: props.account.operational,
        hidden: props.account.hidden,
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required!'),
        currency_id: Yup.number().required('Required!').positive().integer(),
        account_type: Yup.string().required('Required!'),
    });
    return (
        <Dialog title="Account editing" open={props.open} onClose={props.close}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ submitForm, isSubmitting, values }) => (
                    <Form>
                        <DialogContent>
                            <Field
                                type="text"
                                name="account_type"
                                label="Account type"
                                value={values.account_type}
                                select
                                disabled={!props.full}
                                helperText="Please select account type"
                                margin="normal"
                                component={TextField}
                                className="common-field-width">
                                <MenuItem key="ASSET" value="ASSET">
                                    Asset account
                                </MenuItem>
                                <MenuItem key="INCOME" value="INCOME">
                                    Income account
                                </MenuItem>
                                <MenuItem key="EXPENSE" value="EXPENSE">
                                    Expense account
                                </MenuItem>
                            </Field>
                            <ErrorMessage name="account_type" component="div" />
                            <Field
                                type="text"
                                name="name"
                                label="Account name"
                                value={values.name}
                                component={TextField}
                                className="common-field-width"
                            />
                            <ErrorMessage name="name" component="div" />
                            <Field
                                type="text"
                                name="currency_id"
                                label="Account currency"
                                value={values.currency_id}
                                select
                                helperText="Please select currency for account"
                                disabled={!props.full && values.account_type === 'ASSET'}
                                margin="normal"
                                component={TextField}
                                className="common-field-width">
                                {currencies}
                            </Field>
                            <ErrorMessage name="currency_id" component="div" />
                            <Field
                                type="text"
                                name="category_id"
                                label="Account category"
                                value={values.category_id}
                                select
                                helperText="Please select owning category"
                                margin="normal"
                                component={TextField}
                                className="common-field-width">
                                {mapCategoryListToMenu(props.categories, values.account_type)}
                            </Field>
                            <br />
                            <FormControlLabel
                                label="Favorite"
                                control={
                                    <Field
                                        label="Favorite"
                                        type="checkbox"
                                        name="favorite"
                                        checked={values.favorite}
                                        value={values.favorite}
                                        disabled={values.account_type !== 'ASSET'}
                                        component={Switch}
                                    />
                                }
                            />
                            <br />
                            <FormControlLabel
                                label="Operational"
                                control={
                                    <Field
                                        label="Operational"
                                        type="checkbox"
                                        name="operational"
                                        checked={values.operational}
                                        value={values.operational}
                                        disabled={values.account_type !== 'ASSET'}
                                        component={Switch}
                                    />
                                }
                            />
                            <br />
                            <FormControlLabel
                                label="Hidden"
                                control={
                                    <Field
                                        label="Hidden"
                                        type="checkbox"
                                        name="hidden"
                                        checked={values.hidden}
                                        value={values.hidden}
                                        disabled={props.full}
                                        component={Switch}
                                    />
                                }
                            />
                        </DialogContent>
                        <DialogActions>
                            <LoadingButton color="error" disabled={!deletable} loading={loading} onClick={props.close}>
                                Delete
                            </LoadingButton>
                            <div style={{flex: '1 0 0'}} />
                            <Button color="primary" disabled={isSubmitting} onClick={submitForm}>
                                Save
                            </Button>
                            <Button color="secondary" onClick={props.close}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
}

export default AccountDialog;
