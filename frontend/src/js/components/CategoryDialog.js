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

    onTypeChange(event) {
        var attr = {...this.props.category.attributes};
        attr.account_type = event.target.value;
        var category = {...this.props.category, attributes: attr};
        this.props.actions.editCategoryChange(category);
    }

    onNameChange(event) {
        var attr = {...this.props.category.attributes};
        attr.name = event.target.value;
        var category = {...this.props.category, attributes: attr};
        this.props.actions.editCategoryChange(category);
    }

    onOrderChange(event) {
        var attr = {...this.props.category.attributes};
        attr.priority = event.target.value;
        var category = {...this.props.category, attributes: attr};
        this.props.actions.editCategoryChange(category);
    }

    onParentChange(event) {
        var attr = {...this.props.category.attributes};
        attr.parent_id = event.target.value;
        var category = {...this.props.category, attributes: attr};
        this.props.actions.editCategoryChange(category);
    }

    mapCategoryListToMenu(currentId, categoryList) {
      var entries = []

      var entry = <MenuItem key='top' value={currentId}>&lt;TOP&gt;</MenuItem>
      entries.push(entry)

      var mapEntry = function(category, prefix) {
        // We do not want edited category and it's children in a parents list
        if (category.id == currentId) {
          return
        }

        if ('attributes' in category) {
          var attr = category.attributes
        } else {
          attr = category
        }

          var prepend = '-'.repeat(prefix)
          var entry = <MenuItem key={attr.id} value={attr.id}>{prepend}{attr.name}</MenuItem>
          entries.push(entry)
          if (attr.children) {
            for (var item of attr.children) {
              mapEntry(item, prefix+1)
            }
          }
      }

      for (var item of categoryList) {
        mapEntry(item, 0)
      }
      return entries
    }

    render() {
        var props = this.props;

        var nameLabel = 'Category name'
        var nameText = false
        if (props.errors.name) {
          nameLabel = props.errors.name
          nameText = true
        }

        var orderLabel = 'Ordering value'
        var orderText = false
        if (props.errors.order) {
          orderLabel = props.errors.order
          orderText = true
        }

        var parents = this.mapCategoryListToMenu(props.category.id, props.categoryList)

        return (<Dialog title='Category editing' open={props.open}>
        <DialogContent>
          <TextField label={nameLabel} error={nameText} value={props.category.attributes.name} onChange={::this.onNameChange}/>
          <br/>
          <FormControl fullWidth={true}>
              <InputLabel htmlFor={'account-type'}>This category is for account of type</InputLabel>
              <Select value={props.category.attributes.account_type}
                      onChange={::this.onTypeChange}
                      inputProps={{id: 'account-type'}}>
                      <MenuItem key='asset' value='asset'>Asset account</MenuItem>
                      <MenuItem key='income' value='income'>Income account</MenuItem>
                      <MenuItem key='expense' value='expense'>Expense account</MenuItem>
              </Select>
          </FormControl>
          <FormControl fullWidth={true}>
              <InputLabel htmlFor={'parent'}>Parent</InputLabel>
              <Select value={props.category.attributes.parent_id}
                      onChange={::this.onParentChange}
                      inputProps={{id: 'parent'}}>
                      {parents}
              </Select>
          </FormControl>
          <TextField label={orderLabel} error={orderText} value={props.category.attributes.priority} onChange={::this.onOrderChange}/>
        </DialogContent>
        <DialogActions>
          <Button color='primary' disabled={!props.valid} onClick={::this.onSaveClick}>Save</Button>
          <Button color='secondary' onClick={::this.onCancelClick}>Cancel</Button>
        </DialogActions>
        </Dialog>)
    }
}
