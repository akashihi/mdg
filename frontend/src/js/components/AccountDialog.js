import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


export default class AccountDialog extends React.Component {
    onSaveClick() {
        this.props.actions.editAccountSave();
    }

    onCancelClick() {
        this.props.actions.editAccountCancel();
    }

    onTypeChange(event, key, value) {
        var attr = {...this.props.account.attributes};
        attr.account_type = value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onNameChange(event, value) {
        var attr = {...this.props.account.attributes};
        attr.name = value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onAmountChange(event, value) {
        var attr = {...this.props.account.attributes};
        attr.balance = value;
        var account = {...this.props.account, attributes: attr};
        this.props.actions.editAccountChange(account);
    }

    onCurrencyChange(event, key, value) {
        var attr = {...this.props.account.attributes};
        attr.currency_id = value;
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
                <MenuItem value={item.id} key={item.id} primaryText={item.attributes.name}/>
            )
        });

        return (<Dialog title='Account editing' open={props.open}>
            <SelectField floatingLabelText='Account type' disabled={!props.full} value={props.account.attributes.account_type} onChange={::this.onTypeChange} errorText={props.errors.account_type}>
                <MenuItem value='asset' primaryText='Asset account' />
                <MenuItem value='income' primaryText='Income account' />
                <MenuItem value='expense' primaryText='Expense account' />
            </SelectField>
            <br/>
            <TextField hintText='Account name' value={props.account.attributes.name} onChange={::this.onNameChange} errorText={props.errors.name}/>
            <br/>
            <TextField hintText='Initial amount' value={props.account.attributes.balance} disabled={!props.full} onChange={::this.onAmountChange} errorText={props.errors.balance}/>
            <br/>
            <SelectField floatingLabelText='Account currency' disabled={!props.full} value={props.account.attributes.currency_id} onChange={::this.onCurrencyChange} errorText={props.errors.currency_id}>
                {currencies}
            </SelectField>
            <br/>
            <Toggle label='Favorite' toggled={props.account.attributes.favorite} onToggle={::this.onFavoriteChange}/>
            <Toggle label='Operational' toggled={props.account.attributes.operational} onToggle={::this.onOperationalChange}/>
            <Toggle label='Hidden' toggled={props.account.attributes.hidden} onToggle={::this.onHiddenChange} disabled={props.full}/>
            <br/>
            <FlatButton label='Save' primary={true} onClick={::this.onSaveClick} disabled={!props.valid}/>
            <FlatButton label='Cancel' secondary={true} onClick={::this.onCancelClick}/>
        </Dialog>)
    }
}
