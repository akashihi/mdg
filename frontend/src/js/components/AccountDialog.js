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

    onNameChange(event) {
        var attr = {...this.props.account.attributes};
        attr.name = event.target.value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onAmountChange(event) {
        var attr = {...this.props.account.attributes};
        attr.balance = event.target.value;
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

    render() {
        var props = this.props;

        var currencies = props.currencies.map(function (item) {
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

        var amountLabel = 'Initial amount'
        var amountText = false
        if (props.errors.balance) {
          amountLabel = this.props.errors.balance
          amountText = true
        }

        var currencyLabel = 'Account currency'
        var currencyError = false
        if (props.errors.currency_id) {
          currencyLabel = props.errors.currency_id
          currencyError = true
        }

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
          <TextField label={nameLabel} error={nameText} value={props.account.attributes.name} onChange={::this.onNameChange}/>
          <br/>
          <TextField label={amountLabel} error={amountText} value={props.account.attributes.balance} disabled={!props.full} onChange={::this.onAmountChange}/>
          <FormControl error={currencyError} fullWidth={true}>
                <InputLabel htmlFor={'currency'}>{currencyLabel}</InputLabel>
                <Select value={props.account.attributes.currency_id}
                        onChange={::this.onCurrencyChange}
                        disabled={!props.full}
                        inputProps={{id: 'currency'}}>
                        {currencies}
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
