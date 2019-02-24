import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';


export default class AccountDialog extends React.Component {
    onSaveClick() {
        this.props.actions.editAccountSave();
    }

    onCancelClick() {
        this.props.actions.editAccountCancel();
    }

    onTypeChange(event) {
        var attr = {...this.props.account.attributes};
        attr.account_type = event.target.value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onCategoryChange(event) {
        var attr = {...this.props.account.attributes};
        attr.category_id = event.target.value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onAssetChange(event) {
        var attr = {...this.props.account.attributes};
        attr.asset_type = event.target.value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onNameChange(event) {
        var attr = {...this.props.account.attributes};
        attr.name = event.target.value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onCurrencyChange(event) {
        var attr = {...this.props.account.attributes};
        attr.currency_id = event.target.value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onFavoriteChange(event, value) {
        var attr = {...this.props.account.attributes};
        attr.favorite = value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onOperationalChange(event, value) {
        var attr = {...this.props.account.attributes};
        attr.operational = value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onHiddenChange(event, value) {
        var attr = {...this.props.account.attributes};
        attr.hidden = value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    mapCategoryListToMenu(categoryList) {
      var entries = []

      var mapEntry = function(category, prefix) {
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

        var currencies = props.currencies.filter((item) => item.attributes.active).map(function (item) {
            return (
                <MenuItem value={item.id} key={item.id}>{item.attributes.name}</MenuItem>
            )
        });

        var nameLabel = 'Account name'
        var nameText = false
        if (props.errors.name) {
          nameLabel = props.errors.name
          nameText = true
        }

        var currencyLabel = 'Account currency'
        var currencyError = false
        if (props.errors.currency_id) {
          currencyLabel = props.errors.currency_id
          currencyError = true
        }

        var parents = this.mapCategoryListToMenu(props.categoryList.filter((item) => item.attributes.account_type == props.account.attributes.account_type))

        return (<Dialog title='Account editing' open={props.open}>
        <DialogContent>
          <FormControl fullWidth={true}>
              <InputLabel htmlFor={'account-type'}>Account type</InputLabel>
              <Select value={props.account.attributes.account_type}
                      onChange={::this.onTypeChange}
                      inputProps={{id: 'account-type'}}>
                      <MenuItem key='asset' value='asset'>Asset account</MenuItem>
                      <MenuItem key='income' value='income'>Income account</MenuItem>
                      <MenuItem key='expense' value='expense'>Expense account</MenuItem>
              </Select>
          </FormControl>
          <FormControl fullWidth={true}>
              <InputLabel htmlFor={'asset-type'}>Asset type</InputLabel>
              <Select value={props.account.attributes.asset_type}
                      disabled={props.account.attributes.account_type != 'asset'}
                      onChange={::this.onAssetChange}
                      inputProps={{id: 'asset-type'}}>
                      <MenuItem key='cash' value='cash'>Cash account</MenuItem>
                      <MenuItem key='current' value='current'>Current account</MenuItem>
                      <MenuItem key='savings' value='savings'>Savings account</MenuItem>
                      <MenuItem key='deposit' value='deposit'>Deposit account</MenuItem>
                      <MenuItem key='credit' value='credit'>Credit</MenuItem>
                      <MenuItem key='debt' value='debt'>Debt</MenuItem>
                      <MenuItem key='broker' value='broker'>Trading account</MenuItem>
                      <MenuItem key='tradable' value='tradable'>Tradable asset</MenuItem>
              </Select>
          </FormControl>
          <TextField label={nameLabel} error={nameText} value={props.account.attributes.name} onChange={::this.onNameChange}/>
          <br/>
          <FormControl error={currencyError} fullWidth={true}>
                <InputLabel htmlFor={'currency'}>{currencyLabel}</InputLabel>
                <Select value={props.account.attributes.currency_id}
                        onChange={::this.onCurrencyChange}
                        disabled={!props.full}
                        inputProps={{id: 'currency'}}>
                        {currencies}
                </Select>
          </FormControl>
          <FormControl fullWidth={true}>
              <InputLabel htmlFor={'parent'}>Category</InputLabel>
              <Select value={props.account.attributes.category_id}
                      onChange={::this.onCategoryChange}
                      disabled={props.account.attributes.account_type == 'asset'}
                      inputProps={{id: 'parent'}}>
                      {parents}
              </Select>
          </FormControl>
          <FormGroup row>
            <FormControlLabel label='Favorite'
              control={
                <Switch checked={props.account.attributes.favorite} onChange={::this.onFavoriteChange} disabled={props.account.attributes.account_type != 'asset'}/>
              }
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel label='Operational'
              control={
                <Switch checked={props.account.attributes.operational} onChange={::this.onOperationalChange} disabled={props.account.attributes.account_type != 'asset'}/>
              }
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel label='Hidden'
              control={
                <Switch checked={props.account.attributes.hidden} onChange={::this.onHiddenChange} disabled={props.full}/>
              }
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button color='primary' disabled={!props.valid} onClick={::this.onSaveClick}>Save</Button>
          <Button color='secondary' onClick={::this.onCancelClick}>Cancel</Button>
        </DialogActions>
        </Dialog>)
    }
}
