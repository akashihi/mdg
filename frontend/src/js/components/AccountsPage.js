import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {GridList} from 'material-ui/GridList';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';

import Account from './Account'

export default class AccountsPage extends Component {
    componentDidMount() {
        this.props.currencyActions.loadCurrencyList()
    }
    render() {
        var props = this.props;

        var accounts;
        if (props.waiting) {
            accounts = <CircularProgress/>
        } else if (props.error) {
            accounts = <h1>Unable to load account list</h1>
        } else {
            accounts = <div><Account/><Divider/></div>
        }

        return (
            <Card>
                <CardHeader>
                    <Grid fluid>
                        <Row>
                            <Col xs={12} sm={12} md={4} lg={4}>
                                <p>Total: 100500</p>
                            </Col>
                            <Col xs={6} sm={6} md={4} lg={4}>
                                <p>Favorite: 9000</p>
                            </Col>
                            <Col xs={6} sm={6} md={4} lg={4}>
                                <p>Operational: 3.62</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={3} lg={3}>
                                <RaisedButton label='Add new account'/>
                            </Col>
                            <Col xs={12} sm={12} mdoffset={6} md={3} lgoffset={6} lg={3}>
                                <FlatButton label='Show hidden accounts'/>
                            </Col>
                        </Row>
                    </Grid>
                </CardHeader>
                <CardText>

                    <GridList cellHeight={70} cols={1}>
                        {accounts}
                    </GridList>
                </CardText>
            </Card>
        )
    }
}
