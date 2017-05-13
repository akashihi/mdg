import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


export default class AccountDialog extends React.Component {
    render() {
        var props = this.props;
        console.log(props.account);
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
            <TextField hintText='Account name' value={props.account.attributes.name}/>
            <br/>
            <TextField hintText='Initial amount' disabled={!props.full}/>
            <br/>
            <SelectField floatingLabelText='Account currency' disabled={!props.full} value={props.account.attributes.currency_id}>
                {currencies}
            </SelectField>
            <br/>
            <Toggle label='Favorite' toggled={props.account.attributes.favorite}/>
            <Toggle label='Operational' toggled={props.account.attributes.operational}/>
            <Toggle label='Hidden' toggled={props.account.attributes.hidden}/>
            <br/>
            <FlatButton label='Save' primary={true}/>
            <FlatButton label='Cancel' secondary={true}/>
        </Dialog>)
    }
}
