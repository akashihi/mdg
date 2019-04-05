import React from 'react';
import {Map} from 'immutable';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {TextField, Switch} from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';


export default class AccountDialog extends React.Component {

  onSubmit(values) {
      this.props.actions.editAccountSave(Map(values));
  }

    onCancelClick() {
        this.props.actions.editAccountCancel();
    }

    mapCategoryListToMenu(categoryList) {
      var entries = []

      var mapEntry = function(category, prefix) {
          var prepend = '-'.repeat(prefix)
          var entry = <MenuItem key={category.get('id')} value={category.get('id')}>{prepend}{category.get('name')}</MenuItem>
          entries.push(entry)
          if (category.has('children')) {
            category.get('children').forEach(item => mapEntry(item, prefix+1))
          }
      }

      categoryList.forEach(item => mapEntry(item, 0))

      return entries
    }

    render() {
        var props = this.props;

        var currencies = props.currencies.filter((v) => v.get('active'))
            .map((v,k) => (<MenuItem value={k} key={k}>{v.get('name')}</MenuItem>))
            .valueSeq();

        var parents = this.mapCategoryListToMenu(props.categoryList.filter((v) => v.get('account_type') == props.account.get('account_type')))

        var initialValues = {
          account_type: props.account.get('account_type'),
          asset_type: props.account.get('asset_type') ? props.account.get('asset_type') : -1,
          name: props.account.get('name'),
          currency_id: props.account.get('currency_id'),
          category_id: props.account.get('category_id') ? props.account.get('category_id') : -1,
          favorite: props.account.get('favorite'),
          operational: props.account.get('operational'),
          hidden: props.account.get('hidden')
        }

        const validationSchema = Yup.object().shape({
            name: Yup.string().required('Required!'),
            currency_id: Yup.number().required('Required!').positive().integer(),
            account_type: Yup.number().required('Required!').positive().integer(),
        });

        return (<Dialog title='Account editing' open={props.open}>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={::this.onSubmit}>
          {({submitForm, isSubmitting, values}) => (
          <Form>
            <DialogContent>
              <Field
                  type='text'
                  name='account_type'
                  label='Account type'
                  value={values.account_type}
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
              <ErrorMessage name='account_type' component='div'/>
              <Field
                  type='text'
                  name='asset_type'
                  label='Asset type'
                  value={values.asset_type}
                  select
                  disabled={values.account_type != 'asset'}
                  helperText='Please select asset type'
                  margin='normal'
                  component={TextField}
                  className='common-field-width'>
                  <MenuItem key='cash' value='cash'>Cash account</MenuItem>
                  <MenuItem key='current' value='current'>Current account</MenuItem>
                  <MenuItem key='savings' value='savings'>Savings account</MenuItem>
                  <MenuItem key='deposit' value='deposit'>Deposit account</MenuItem>
                  <MenuItem key='credit' value='credit'>Credit</MenuItem>
                  <MenuItem key='debt' value='debt'>Debt</MenuItem>
                  <MenuItem key='broker' value='broker'>Trading account</MenuItem>
                  <MenuItem key='tradable' value='tradable'>Tradable asset</MenuItem>
              </Field>
              <Field type='text' name='name' label='Account name' value={values.name} component={TextField} className='common-field-width'/>
              <ErrorMessage name='name' component='div'/>
              <Field
                  type='text'
                  name='currency_id'
                  label='Account currency'
                  value={values.currency_id}
                  select
                  helperText='Please select currency for account'
                  margin='normal'
                  component={TextField}
                  className='common-field-width'>
                  {currencies}
              </Field>
              <ErrorMessage name='currency_id' component='div'/>
              <Field
                  type='text'
                  name='category_id'
                  label='Account category'
                  value={values.category_id}
                  select
                  helperText='Please select owning category'
                  margin='normal'
                  component={TextField}
                  className='common-field-width'>
                  {parents}
              </Field>
            <br/>
            <FormControlLabel label='Favorite' control={
              <Field
                label='Favorite'
                type='checkbox'
                name='favorite'
                checked={values.favorite}
                value={values.favorite}
                disabled={values.account_type != 'asset'}
                component={Switch}
                />
              }/>
              <br/>
              <FormControlLabel label='Favorite' control={
                <Field
                  label='Operational'
                  type='checkbox'
                  name='operational'
                  checked={values.operational}
                  value={values.operational}
                  disabled={values.account_type != 'asset'}
                  component={Switch}
                  />
                }/>
                <br/>
                <FormControlLabel label='Favorite' control={
                  <Field
                    label='Hidden'
                    type='checkbox'
                    name='hidden'
                    checked={values.hidden}
                    value={values.hidden}
                    disabled={!props.full}
                    component={Switch}
                    />
                  }/>
            </DialogContent>
            <DialogActions>
              <Button color='primary' disabled={isSubmitting} onClick={submitForm}>Save</Button>
              <Button color='secondary' onClick={::this.onCancelClick}>Cancel</Button>
            </DialogActions>
          </Form>
        )}
        </Formik>
      </Dialog>)
    }
}
