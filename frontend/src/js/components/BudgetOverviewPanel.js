import React, {Component} from 'react';
import {CardHeader, CardText} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';

export default class BudgetOverviewPanel extends Component {
    render() {
        var props = this.props;
        var attrs = props.budget.attributes;

        var totalChange = attrs.state.change.actual + attrs.state.change.expected;
        if (totalChange > 0) {
            var percentActualChange = attrs.state.change.actual / totalChange;
        }

        if (attrs.state.income.expected) {
            var incomePercentage = attrs.state.income.actual/attrs.state.income.expected*100;
            if (incomePercentage>100) {
                incomePercentage = 100;
            }
        }

        if (attrs.state.expense.expected) {
            var expensePercentage = attrs.state.expense.actual/attrs.state.expense.expected*100;
            if (expensePercentage>100) {
                expensePercentage = 100;
            }
        }

        return (
            <div>
                <CardHeader style={{'text-align': 'center'}}>
                    Budget for: {attrs.term_beginning}&nbsp;-&nbsp;{attrs.term_end}
                </CardHeader>
                <CardText>
                    <Grid fluid>
                        <Row>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p>Assets first day: {attrs.incoming_amount}</p>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p style={{'text-align': 'center'}}>Actual assets last
                                    day: {attrs.outgoing_amount.actual}</p>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p style={{'text-align': 'right'}}>Expected assets last
                                    day: {attrs.outgoing_amount.expected}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p>Income</p>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p style={{'text-align': 'center'}}>Budget execution</p>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p style={{'text-align': 'right'}}>Expenses</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <p><CircularProgress
                                    mode='determinate'
                                    value={incomePercentage}
                                    size={80}
                                    thickness={5}
                                /></p>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <p style={{'text-align': 'right'}}><CircularProgress
                                    mode='determinate'
                                    value={expensePercentage}
                                    size={80}
                                    thickness={5}
                                /></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <p>{attrs.state.income.actual} of {attrs.state.income.expected}</p>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <p style={{'text-align': 'right'}}>{attrs.state.expense.actual} of {attrs.state.expense.expected}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                Spent today: {attrs.state.change.actual}
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <p style={{'text-align': 'right'}}>Left today: {attrs.state.change.expected}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xsOffset={1} xs={10} sm={10} smOffset={1} md={10} mdOffset={1} lg={10} lgOffset={1}>
                                <LinearProgress mode='determinate' value={percentActualChange}/>
                            </Col>
                        </Row>
                    </Grid>
                </CardText>
            </div>
        )
    }
}
