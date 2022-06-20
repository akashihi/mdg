import React, {Component} from 'react';
import Button from '@mui/material/Button';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Edit from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import ClipLoader from 'react-spinners/ClipLoader';

//export default class Account extends Component
function Account() {
    function getCurrency(account, currencies) {
        if (currencies.has(account.get('currency_id'))) {
            return currencies.get(account.get('currency_id')).get('name');
        } else {
            return '';
        }
    }

    function render() {
        const account = this.props.account;
        let favIcon;
        let opIcon;

        if (account.get('loading')) {
            // Fast processing
            return <ClipLoader sizeUnit='px' size={15} loading/>;
        }

        let balanceStyle = {
            color: 'black',
            fontWeight: 'normal'
        };

        if (account.get('account_type') === 'asset') {
            if (account.get('balance') < 0) {
                balanceStyle = {
                    color: 'red',
                    fontWeight: 'bold'
                };
            }
            if (account.get('favorite')) {
                favIcon =
                    <Button aria-label='Favorite' onClick={() => this.props.switchFunc('favorite')}><Favorite/></Button>
            } else {
                favIcon = <Button aria-label='Not favorite'
                                  onClick={() => this.props.switchFunc('favorite')}><FavoriteBorder/></Button>
            }
            if (account.get('operational')) {
                opIcon = <Button aria-label='Operational'
                                 onClick={() => this.props.switchFunc('operational')}><Star/></Button>
            } else {
                opIcon = <Button aria-label='Not operational'
                                 onClick={() => this.props.switchFunc('operational')}><StarBorder/></Button>
            }
        }
        let visibilityIcon = <Button aria-label='Visible' onClick={() => this.props.switchFunc('hidden')}><Visibility/></Button>
        if (account.get('hidden')) {
            visibilityIcon =
                <Button aria-label='Hidden' onClick={() => this.props.switchFunc('hidden')}><VisibilityOff/></Button>
        }

        const currency = this.getCurrency(account, this.props.currencies);

        return (
            <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={4} lg={4}>
                    {account.get('name')}
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={4}>
                    <div style={balanceStyle}>{account.get('balance')} {currency}</div>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} className='hide-on-small'>
                    {favIcon}
                    {opIcon}
                    {!this.props.preview && visibilityIcon}
                    {!this.props.preview &&
                    <Button aria-label='Edit' onClick={this.props.editAccountFunc}><Edit/></Button>}
                </Grid>
            </Grid>
        )
    }
}

export default Account;
