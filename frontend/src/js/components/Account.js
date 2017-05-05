import React, {Component} from 'react';
import {Card, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import {GridTile} from 'material-ui/GridList';
import FontIcon from 'material-ui/FontIcon';
import {Grid, Row, Col} from 'react-flexbox-grid';


export default class Account extends Component {
    getCurrency = function(account, currencies) {
        var currencyId = account.currency_id;
        var names = currencies.filter((item) => item.id == currencyId).map((item) => item.attributes.name);
        return names[0];
    };

    render() {
        var attr = this.props.account.attributes;
        var favIcon;
        var opIcon;
        if (attr.account_type == 'asset') {
            if (attr.favorite) {
                favIcon = <IconButton><FontIcon className='material-icons'>favorite</FontIcon></IconButton>
            } else {
                favIcon = <IconButton><FontIcon className='material-icons'>favorite_border</FontIcon></IconButton>
            }
            if (attr.operational) {
                opIcon = <IconButton><FontIcon className='material-icons'>star</FontIcon></IconButton>
            } else {
                opIcon = <IconButton><FontIcon className='material-icons'>star_border</FontIcon></IconButton>
            }
        }
        var visibilityIcon = <IconButton><FontIcon className='material-icons'>visibility</FontIcon></IconButton>
        if (attr.hidden) {
            visibilityIcon = <IconButton><FontIcon className='material-icons'>visibility_off</FontIcon></IconButton>
        }

        var currency = this.getCurrency(attr, this.props.currencies);

        return (
            <GridTile>
                <Card>
                    <CardText>
                        <Grid fluid>
                            <Row>
                                <Col xs={12} sm={12} md={4} lg={4}>
                                    <p>{attr.name}</p>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4}>
                                    <p>{attr.balance} {currency}</p>
                                </Col>
                                <Col xs={12} sm={12} md={4} lg={4}>
                                    {favIcon}
                                    {opIcon}
                                    {visibilityIcon}
                                    <IconButton><FontIcon className='material-icons'>mode_edit</FontIcon></IconButton>
                                </Col>
                            </Row>
                        </Grid>
                    </CardText>
                </Card>
            </GridTile>
        )
    }
}
