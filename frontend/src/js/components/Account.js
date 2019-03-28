import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Edit from '@material-ui/icons/Edit';
import {Grid, Row, Col} from 'react-flexbox-grid';


export default class Account extends Component {
    getCurrency = function(account, currencies) {
        return currencies.find((v, k) => k === account.currency_id).get('name')
    };

    render() {
        var attr = this.props.account.attributes;
        var favIcon;
        var opIcon;

        var balance_style = {
            'color': 'black',
            'fontWeight': 'normal'
        };

        if (attr.account_type == 'asset') {
            if (attr.balance <0 ) {
                balance_style = {
                    'color': 'red',
                    'fontWeight': 'bold'
                };
            }
            if (attr.favorite) {
                favIcon = <Button aria-label='Favorite' onClick={()=>this.props.switchFavoriteFunc(this.props.account, !attr.favorite)}><Favorite/></Button>
            } else {
                favIcon = <Button aria-label='Not favorite' onClick={()=>this.props.switchFavoriteFunc(this.props.account, !attr.favorite)}><FavoriteBorder/></Button>
            }
            if (attr.operational) {
                opIcon = <Button aria-label='Operational' onClick={()=>this.props.switchOperationalFunc(this.props.account, !attr.operational)}><Star/></Button>
            } else {
                opIcon = <Button aria-label='Not operational' onClick={()=>this.props.switchOperationalFunc(this.props.account, !attr.operational)}><StarBorder/></Button>
            }
        }
        var visibilityIcon = <Button aria-label='Visible' onClick={()=>this.props.switchHiddenFunc(this.props.account, !attr.hidden)}><Visibility/></Button>;
        if (attr.hidden) {
            visibilityIcon = <Button aria-label='Hidden' onClick={()=>this.props.switchHiddenFunc(this.props.account, !attr.hidden)}><VisibilityOff/></Button>;
        }

        var currency = this.getCurrency(attr, this.props.currencies);

        return (
            <Grid fluid>
                <Row>
                    <Col xs={12} sm={12} md={4} lg={4}>
                        <p>{attr.name}</p>
                    </Col>
                    <Col xs={12} sm={12} md={3} lg={3}>
                        <p style={balance_style}>{attr.balance} {currency}</p>
                    </Col>
                    <Col xs={12} sm={12} md={5} lg={5}>
                        {favIcon}
                        {opIcon}
                        {visibilityIcon}
                        <Button aria-label='Edit' onClick={()=>this.props.editAccountFunc(this.props.account)}><Edit/></Button>
                    </Col>
                </Row>
            </Grid>
        )
    }
}
