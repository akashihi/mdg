import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import Category from '../../models/Category';
import { mapCategoryListToMenu } from '../../util/CategoryUtils';

export interface CategoryDialogProps {
    open: boolean;
    full: boolean;
    category: Partial<Category>;
    categoryList: Category[];
    close: () => void;
    delete: () => void;
    save: (c: Category) => void;
}

export function CategoryDialog(props: CategoryDialogProps) {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required!'),
        priority: Yup.number().required('Required!').positive().integer(),
    });

    return (
        <Dialog open={props.open} onClose={props.close}>
            <DialogTitle>Edit category</DialogTitle>
            <Formik
                initialValues={props.category}
                validationSchema={validationSchema}
                onSubmit={values => props.save(values as Category)}>
                {({ submitForm, isSubmitting, values }) => (
                    <Form>
                        <DialogContent>
                            <Field
                                type="text"
                                name="name"
                                label="Category name"
                                component={TextField}
                                className="common-field-width"
                            />
                            <ErrorMessage name="name" component="div" />
                            <br />
                            <Field
                                type="text"
                                name="account_type"
                                label="This category is for accounts of type"
                                select
                                disabled={!props.full}
                                helperText="Please select account type"
                                margin="normal"
                                component={TextField}
                                className="common-field-width">
                                {!props.full && (
                                    <MenuItem key="asset" value="ASSET">
                                        Asset account
                                    </MenuItem>
                                )}
                                <MenuItem key="income" value="INCOME">
                                    Income account
                                </MenuItem>
                                <MenuItem key="expense" value="EXPENSE">
                                    Expense account
                                </MenuItem>
                            </Field>
                            <br />
                            <Field
                                type="text"
                                name="parent_id"
                                label="Parent"
                                select
                                helperText="Please select parent"
                                margin="normal"
                                component={TextField}
                                disabled={values.account_type === 'ASSET'}
                                className="common-field-width">
                                {mapCategoryListToMenu(props.categoryList, values.account_type, props.category.id)}
                            </Field>
                            <br />
                            <Field
                                type="number"
                                name="priority"
                                label="Ordering value"
                                component={TextField}
                                className="common-field-width"
                            />
                            <ErrorMessage name="priority" component="div" />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color="primary"
                                disabled={props.full || values.account_type === 'ASSET'}
                                variant="contained"
                                onClick={props.delete}>
                                Delete
                            </Button>
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

export default CategoryDialog;
