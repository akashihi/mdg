import React, {Component, Fragment} from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ClipLoader from 'react-spinners/ClipLoader';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import SettingsEditor from '../../containers/SettingsEditor';
import CategoryViewer from '../../containers/CategoryViewer.js';

/*class CurrencyEditor extends Component {
    onCurrencyChange(k, item) {
        const modified = item.set('active', !item.get('active'));
        this.props.currencyActions.updateCurrency(k, modified)
    }

    render() {
        const cls = this;
        const props = this.props;

        if (props.currency.get('loading')) {
            return <ClipLoader sizeUnit={'px'} size={180} loading={true}/>
        }

        if (props.currency.get('error')) {
            return <h1>Error loading currency list</h1>
        }

        const allCurrencies = props.currency.get('currencies').map((v, k) => {
            return (
                <ListItem key={k} dense button>
                    <ListItemText primary={v.get('name')}/>
                    <ListItemSecondaryAction><Checkbox checked={v.get('active')}
                                                       onChange={() => cls.onCurrencyChange(k, v)}/></ListItemSecondaryAction>
                </ListItem>
            )
        }).valueSeq().toJS();

        return (<List sx={{
            position: 'relative',
            overflow: 'auto',
            maxHeight: 160,
            margin: '1em'
        }}>
            {allCurrencies}
        </List>)
    }
}
*/


export function SettingsPage() {
        return (
                <Paper variant='outlined'>
                    <SettingsEditor/>
                </Paper>
        )
    /*<SettingEditor ui={props.setting.ui} currency={props.currency}
                               primaryCurrency={props.primaryCurrency}
                               closeTransactionDialog={props.closeTransactionDialog}
                               language={props.language}
                               actions={props.actions}/>*/
    /*<Divider/>
    <Grid item xs={12} sm={6} md={6} lg={4}>
        <p>Active currencies:</p>
    </Grid>
    <Grid item xs={12} sm={6} md={6} lg={4}>
        <CurrencyEditor currency={props.currency} currencyActions={this.props.currencyActions}/>
    </Grid>
<Divider/>
    <Grid item xs={12} sm={12} md={12} lg={12}>
        <CategoryViewer/>
    </Grid>*/
}

export default SettingsPage;
