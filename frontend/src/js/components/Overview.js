import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Card from '@material-ui/core/Card';

import AccountsOverview from '../containers/AccountsOverview'
import BudgetOverview from '../containers/BudgetOverview'
import FinanceOverview from '../containers/FinanceOverview'
import TransactionsOverview from '../containers/TransactionsOverview'

export default class Overview extends Component {
    render() {

        var cardStyle = {
            height: 400,
            'marginTop': 15
        };

        return (
            <Grid fluid>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card style={cardStyle}>
                            <AccountsOverview/>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card style={cardStyle}>
                            <FinanceOverview/>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card style={cardStyle}>
                            <BudgetOverview short={true}/>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card style={cardStyle}>
                            <TransactionsOverview/>
                        </Card>
                    </Col>
                </Row>
            </Grid>
        )
    }
}
