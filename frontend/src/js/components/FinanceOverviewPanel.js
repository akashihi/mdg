import React, {Component} from 'react';
import {CardHeader, CardText} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';

export default class FinanceOverviewPanel extends Component {

    render() {
        var props = this.props;

        var totals = props.assetAccounts.reduce((memo, obj) => {
            if (!(obj.attributes.currency_id in memo)) {
                memo[obj.attributes.currency_id] = 0
            }
            memo[obj.attributes.currency_id] += obj.attributes.balance;
            return memo
        }, {});

        var result = Object.keys(totals).map((currency_id) => {
            var value = totals[currency_id];
            var name = props.currencies.filter((item) => item.id == currency_id).map((item) => item.attributes.name);
            return (
                <Row key={currency_id}>
                    <Col xs={2} sm={2} md={2} lg={2}>
                        <p>{name}:</p>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                        <p style={{'textAlign': 'right'}}>{value}</p>
                    </Col>
                </Row>
            )
        });

        return (
            <div>
                <CardHeader title='Financial status'/>
                <CardText>
                    <Grid fluid>
                        {result}
                    </Grid>
                </CardText>
            </div>
        )
    }
}
