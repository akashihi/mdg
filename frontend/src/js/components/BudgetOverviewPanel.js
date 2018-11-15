import React, {Component} from 'react';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SegmentedProgressbar from '../widgets/SegmentedProgressbar'
import { Progress } from 'react-sweet-progress';

export default class BudgetOverviewPanel extends Component {
    render() {
        var props = this.props;
        var attrs = props.budget.attributes;

        var totalChange = attrs.state.change.actual + attrs.state.change.expected;
        if (totalChange > 0) {
            var percentActualChange = Math.round(attrs.state.change.actual / totalChange);
        }

        if (attrs.state.income.expected) {
            var incomePercentage = Math.round(attrs.state.income.actual/attrs.state.income.expected*100);
            if (incomePercentage>100) {
                incomePercentage = 100;
            }
        }

        if (attrs.state.expense.expected) {
            var expensePercentage = Math.round(attrs.state.expense.actual/attrs.state.expense.expected*100);
            if (expensePercentage>100) {
                expensePercentage = 100;
            }
        }

        var actual_profit = (attrs.outgoing_amount.actual - attrs.incoming_amount).toFixed(2)
        actual_profit = (actual_profit <= 0 ?'':'+') + actual_profit
        var expected_profit = (attrs.outgoing_amount.expected - attrs.incoming_amount).toFixed(2)
        expected_profit = (expected_profit <= 0 ?'':'+') + expected_profit

        var title = 'Budget for: ' + attrs.term_beginning + ' - ' + attrs.term_end

        return (
            <div>
                <CardHeader title={title}/>
                <CardContent>
                    <Grid fluid>
                        <Row>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p>Assets first day: {attrs.incoming_amount.toFixed(2)}</p>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p style={{'textAlign': 'center'}}>Actual assets last
                                    day: {attrs.outgoing_amount.actual.toFixed(2)} ({actual_profit})</p>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p style={{'textAlign': 'right'}}>Expected assets last
                                    day: {attrs.outgoing_amount.expected.toFixed(2)} ({expected_profit})</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p>Income</p>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p style={{'textAlign': 'center'}}>Budget execution</p>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <p style={{'textAlign': 'right'}}>Expenses</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}>
                              <div style={{ width: '80px', height: '80px' }}>
                                <SegmentedProgressbar percentage={incomePercentage}/>
                              </div>
                            </Col>
                            <Col xsOffset={10} xs={1}>
                              <div style={{ width: '80px', height: '80px', textAlign: 'right' }}>
                                <SegmentedProgressbar percentage={expensePercentage}/>
                              </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <p>{attrs.state.income.actual} of {attrs.state.income.expected}</p>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <p style={{'textAlign': 'right'}}>{attrs.state.expense.actual} of {attrs.state.expense.expected}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                Spent today: {attrs.state.change.actual}
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <p style={{'textAlign': 'right'}}>Left today: {attrs.state.change.expected}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xsOffset={1} xs={10} sm={10} smOffset={1} md={10} mdOffset={1} lg={10} lgOffset={1}>
                              <Progress percent={percentActualChange}/>
                            </Col>
                        </Row>
                    </Grid>
                </CardContent>
            </div>
        )
    }
}
