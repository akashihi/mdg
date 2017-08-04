import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Card, CardHeader, CardText} from 'material-ui/Card';

import AccountsOverview from '../containers/AccountsOverview'
import BudgetOverview from '../containers/BudgetOverview'

export default class Overview extends Component {
    render() {

        var cardStyle = {
            height: 400,
            'margin-top': 15
        };

        return (
            <Grid fluid>
                <Row st>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card style={cardStyle}>
                            <AccountsOverview/>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card style={cardStyle}>
                            <CardHeader title='Financial status'/>
                            <CardText>Состояние</CardText>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card style={cardStyle}>
                            <BudgetOverview/>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card style={cardStyle}>
                            <CardHeader title='Операции'/>
                            <CardText>Операции</CardText>
                        </Card>
                    </Col>
                </Row>
            </Grid>
        )
    }
}
