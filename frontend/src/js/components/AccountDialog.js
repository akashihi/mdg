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

    onNameChange(event, value) {
        var attr = {...this.props.account.attributes};
        attr.name = value;
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
            <SelectField floatingLabelText="Account type" disabled={!props.full} value={props.account.attributes.account_type}>
                <MenuItem value='asset' primaryText='Asset account' />
                <MenuItem value='income' primaryText='Income account' />
                <MenuItem value='expense' primaryText='Expense account' />
            </SelectField>
            <br/>
            <TextField hintText='Account name' value={props.account.attributes.name} onChange={::this.onNameChange}/>
            <br/>
            <TextField hintText='Initial amount' value={props.account.attributes.balance} disabled={!props.full}/>
            <br/>
            <SelectField floatingLabelText='Account currency' disabled={!props.full} value={props.account.attributes.currency_id}>
                {currencies}
            </SelectField>
            <br/>
            <Toggle label='Favorite' toggled={props.account.attributes.favorite}/>
            <Toggle label='Operational' toggled={props.account.attributes.operational}/>
            <Toggle label='Hidden' toggled={props.account.attributes.hidden}/>
            <br/>
            <FlatButton label='Save' primary={true} onClick={::this.onSaveClick}/>
            <FlatButton label='Cancel' secondary={true} onClick={::this.onCancelClick}/>
        </Dialog>)
    }
}
