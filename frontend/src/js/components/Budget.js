import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';

export default class Budget extends Component {
    render() {
        var attr = this.props.budget.attributes;
        var title = attr.term_beginning + ' - ' + attr.term_end;
        var income_expected = attr.outgoing_amount.expected - attr.incoming_amount;
        var income_actual = attr.outgoing_amount.actual - attr.incoming_amount
        return (
            <Card>
                <CardHeader title={title}/>
                <CardText>
                    <p>Actual income: {income_actual}</p>
                    <p>Expected income: {income_expected}</p>
                </CardText>
            </Card>
        )
    }
}
