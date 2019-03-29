import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';


export default class CategoryDialog extends React.Component {
    onSaveClick() {
        this.props.actions.editCategorySave();
    }

    onCancelClick() {
        this.props.actions.editCategoryCancel();
    }

    onDeleteClick() {
        this.props.actions.editCategoryDelete();
    }

    onPropChange(id, prop, event) {
        var category = this.props.category.set(prop, event.target.value)
        this.props.actions.editCategoryChange(category);
    }

    mapCategoryListToMenu(currentId, account_type, categoryList) {
      var entries = []

      var entry = <MenuItem key='top' value={currentId}>&lt;TOP&gt;</MenuItem>
      entries.push(entry)

      var mapEntry = function(id, category, prefix) {
        // We do not want edited category and it's children in a parents list
        if (id == currentId) {
          return
        }

          var prepend = '-'.repeat(prefix)
          var entry = <MenuItem key={id} value={id}>{prepend}{category.get('name')}</MenuItem>
          entries.push(entry)
          if (category.has('children')) {
            category.get('children').forEach((v, k) => {
              mapEntry(k, v, prefix+1)
            })
          }
      }

      categoryList.filter(v => v.get('account_type') == account_type).forEach((v, k) => {mapEntry(k, v, 0)})
      return entries
    }

    render() {
        var props = this.props;

        var nameLabel = 'Category name'
        var nameText = false
        if (props.errors.has('name')) {
          nameLabel = props.errors.get('name')
          nameText = true
        }

        var orderLabel = 'Ordering value'
        var orderText = false
        if (props.errors.has('order')) {
          orderLabel = props.errors.get('order')
          orderText = true
        }

        var parents = this.mapCategoryListToMenu(props.id, props.category.get('account_type'), props.categoryList)
        
        return (<Dialog title='Category editing' open={props.open}>
        <DialogContent>
          <TextField label={nameLabel} error={nameText} value={props.category.get('name')} onChange={(event) => ::this.onPropChange(props.id, 'name', event)}/>
          <br/>
          <FormControl fullWidth={true}>
              <InputLabel htmlFor={'account-type'}>This category is for account of type</InputLabel>
              <Select value={props.category.get('account_type')}
                      onChange={(event) => ::this.onPropChange(props.id, 'account_type', event)}
                      disabled={!props.full}
                      inputProps={{id: 'account-type'}}>
                      {/*<MenuItem key='asset' value='asset'>Asset account</MenuItem>*/}
                      <MenuItem key='income' value='income'>Income account</MenuItem>
                      <MenuItem key='expense' value='expense'>Expense account</MenuItem>
              </Select>
          </FormControl>
          <FormControl fullWidth={true}>
              <InputLabel htmlFor={'parent'}>Parent</InputLabel>
              <Select value={props.category.get('parent_id')}
                      onChange={(event) => ::this.onPropChange(props.id, 'parent_id', event)}
                      inputProps={{id: 'parent'}}>
                      {parents}
              </Select>
          </FormControl>
          <TextField label={orderLabel} error={orderText} value={props.category.get('priority')} onChange={(event) => ::this.onPropChange(props.id, 'priority', event)}/>
        </DialogContent>
        <DialogActions>
          <Button color='primary' disabled={props.full} variant='contained' onClick={::this.onDeleteClick}>Delete</Button>
          <Button color='primary' disabled={!props.valid} onClick={::this.onSaveClick}>Save</Button>
          <Button color='secondary' onClick={::this.onCancelClick}>Cancel</Button>
        </DialogActions>
        </Dialog>)
    }
}
