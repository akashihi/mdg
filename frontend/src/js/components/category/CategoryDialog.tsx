import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {TextField} from 'formik-mui';
import * as Yup from 'yup';
import Category from "../../models/Category";

export interface CategoryDialogProps {
    open: boolean;
    full: boolean;
    category: Partial<Category>;
    categoryList: Category[];
    close: () => void;
}

export function CategoryDialog(props: CategoryDialogProps) {

    /*onSubmit(values) {
        this.props.actions.editCategorySave(Map(values));
    }

    onDeleteClick() {
        this.props.actions.editCategoryDelete();
    }

    */

    const mapCategoryListToMenu = (account_type:string) => {
        let entries = [];

        let entry = <MenuItem key='top' value={-1}>&lt;TOP&gt;</MenuItem>;
        entries.push(entry);

        const mapEntry = function (category: Category, prefix: number) {
            // We do not want edited category and it's children in a parents list
            if (category.id === props.category.id) {
                return
            }

            const prepend = '-'.repeat(prefix);
            const entry = <MenuItem key={category.id} value={category.id}>{prepend}{category.name}</MenuItem>;
            entries.push(entry);
            if (Array.isArray(category.children)) {
                category.children.forEach((c) => {
                    mapEntry(c, prefix + 1)
                })
            }
        };

        props.categoryList.filter(v => v.account_type.toLowerCase() === account_type.toLowerCase()).forEach((c) => {
            mapEntry(c, 0)
        });
        return entries
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Required!'),
        priority: Yup.number().required('Required!').positive().integer(),
    })

    return (
        <Dialog open={props.open} onClose={props.close}>
            <DialogTitle>Edit category</DialogTitle>
            <Formik initialValues={props.category} validationSchema={validationSchema} onSubmit={(values) => console.log(values)}>
                {({submitForm, isSubmitting, values}) => (
                    <Form>
                        <DialogContent>
                            <Field type='text' name='name' label='Category name' component={TextField} className='common-field-width'/>
                            <ErrorMessage name='name' component='div'/>
                            <br/>
                            <Field
                                type='text'
                                name='account_type'
                                label='This category is for accounts of type'
                                select
                                disabled={!props.full}
                                helperText='Please select account type'
                                margin='normal'
                                component={TextField}
                                className='common-field-width'>
                                <MenuItem key='asset' value='asset'>Asset account</MenuItem>
                                <MenuItem key='income' value='income'>Income account</MenuItem>
                                <MenuItem key='expense' value='expense'>Expense account</MenuItem>
                            </Field>
                            <br/>
                            <Field
                                type='text'
                                name='parent_id'
                                label='Parent'
                                select
                                helperText='Please select parent'
                                margin='normal'
                                component={TextField}
                                disabled={values.account_type === 'asset'}
                                className='common-field-width'>
                                {mapCategoryListToMenu(values.account_type)}
                            </Field>
                            <br/>
                            <Field type='number' name='priority' label='Ordering value' component={TextField} className='common-field-width'/>
                            <ErrorMessage name='priority' component='div'/>
                        </DialogContent>
                        <DialogActions>
                            <Button color='primary' disabled={props.full || values.account_type === 'asset'} variant='contained'>Delete</Button>
                            <Button color='primary' disabled={isSubmitting} onClick={submitForm}>Save</Button>
                            <Button color='secondary' onClick={props.close}>Cancel</Button>
                        </DialogActions>
                    </Form>
                    )}
            </Formik>
        </Dialog>
    )
}

export default CategoryDialog;
