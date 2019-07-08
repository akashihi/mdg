import React from 'react';
import {Map} from 'immutable';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {TextField} from 'formik-material-ui';
import * as Yup from 'yup';

export default class CategoryDialog extends React.Component {

    onSubmit(values) {
        this.props.actions.editCategorySave(Map(values));
    }

    onCancelClick() {
        this.props.actions.editCategoryCancel();
    }

    onDeleteClick() {
        this.props.actions.editCategoryDelete();
    }

    mapCategoryListToMenu(account_type) {
        var props = this.props;
        var entries = [];

        var entry = <MenuItem key='top' value={props.id}>&lt;TOP&gt;</MenuItem>;
        entries.push(entry);

        var mapEntry = function (id, category, prefix) {
            // We do not want edited category and it's children in a parents list
            if (id === props.id) {
                return
            }

            var prepend = '-'.repeat(prefix);
            var entry = <MenuItem key={id} value={id}>{prepend}{category.get('name')}</MenuItem>;
            entries.push(entry);
            if (category.has('children')) {
                category.get('children').forEach((v, k) => {
                    mapEntry(k, v, prefix + 1)
                })
            }
        };

        props.categoryList.filter(v => v.get('account_type') === account_type).forEach((v, k) => {
            mapEntry(k, v, 0)
        });
        return entries
    }

    render() {
        var props = this.props;

        var initialValues = {
            name: props.category.get('name'),
            account_type: props.category.get('account_type'),
            parent_id: props.category.get('parent_id'),
            priority: props.category.get('priority')
        };

        const validationSchema = Yup.object().shape({
            name: Yup.string().required('Required!'),
            priority: Yup.number().required('Required!').positive().integer(),
        });

        return (<Dialog title='Category editing' open={props.open}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={::this.onSubmit}>
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
                                {/*<MenuItem key='asset' value='asset'>Asset account</MenuItem>*/}
                                <MenuItem key='income' value='income'>Income account</MenuItem>
                                <MenuItem key='expense' value='expense'>Expense account</MenuItem>
                                ))}
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
                                {::this.mapCategoryListToMenu(values.account_type)}
                                ))}
                            </Field>
                            <br/>
                            <Field type='number' name='priority' label='Ordering value' component={TextField} className='common-field-width'/>
                            <ErrorMessage name='priority' component='div'/>
                        </DialogContent>
                        <DialogActions>
                            <Button color='primary' disabled={props.full || values.account_type === 'asset'} variant='contained'
                                    onClick={::this.onDeleteClick}>Delete</Button>
                            <Button color='primary' disabled={isSubmitting} onClick={submitForm}>Save</Button>
                            <Button color='secondary' onClick={::this.onCancelClick}>Cancel</Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>)
    }
}
