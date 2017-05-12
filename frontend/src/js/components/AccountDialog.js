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
        return (<Dialog title='Account editing' open={props.open}>
            <SelectField floatingLabelText="Account type">
                <MenuItem value='asset' primaryText='Asset account' />
                <MenuItem value='income' primaryText='Income account' />
                <MenuItem value='expense' primaryText='Expense account' />
            </SelectField>
            <br/>
            <TextField hintText='Account name'/>
            <br/>
            <TextField hintText='Initial amount'/>
            <br/>
            <SelectField floatingLabelText="Account currency">
                <MenuItem value={1} primaryText='CZK' />
                <MenuItem value={2} primaryText='EUR' />
                <MenuItem value={3} primaryText='BTC' />
            </SelectField>
            <br/>
            <Toggle label='Favorite' />
            <Toggle label='Operational' />
            <Toggle label='Hidden' />
            <br/>
            <FlatButton label="Save" primary={true}/>
            <FlatButton label="Cancel" secondary={true}/>
        </Dialog>)
    }
}
