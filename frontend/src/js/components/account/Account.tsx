import React from 'react';
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
import {Account} from "../../models/Account";

export interface AccountProps {
    account: Account
}

function Account(props: AccountProps) {
    let balanceStyle = {
        color: 'black',
        fontWeight: 'normal'
    };

    let favIcon;
    let opIcon;

    if (props.account.account_type === 'ASSET') {
        if (props.account.balance < 0) {
            balanceStyle = {
                color: 'red',
                fontWeight: 'bold'
            };
        }

        if (props.account.favorite) {
            favIcon =
                <Button aria-label='Favorite'><Favorite/></Button>;
        } else {
            favIcon = <Button aria-label='Not favorite'><FavoriteBorder/></Button>;
        }
        if (props.account.operational) {
            opIcon = <Button aria-label='Operational'><Star/></Button>;
        } else {
            opIcon = <Button aria-label='Not operational'><StarBorder/></Button>;
        }
    }

    let visibilityIcon = <Button aria-label='Visible'><Visibility/></Button>;
    if (props.account.hidden) {
        visibilityIcon = <Button aria-label='Hidden'><VisibilityOff/></Button>;
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={4} lg={4}>
                {props.account.name}
            </Grid>
            <Grid item xs={6} sm={6} md={4} lg={4}>
                <div style={balanceStyle}>{props.account.balance} {props.account.currency.name}</div>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} className='hide-on-small'>
                {favIcon}
                {opIcon}
                {visibilityIcon}
                <Button aria-label='Edit'><Edit/></Button>
            </Grid>
        </Grid>
    )
}

export default Account;
