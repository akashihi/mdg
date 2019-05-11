import React, {Component} from 'react';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SegmentedProgressbar from '../widgets/SegmentedProgressbar'
import Divider from '@material-ui/core/Divider';
import {Progress} from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

export default class BudgetOverviewPanel extends Component {
    cardStyle = {
        padding: '0px',
        paddingBottom: '16px'
    };

    cardHeaderStyle = {
        paddingTop: '0px',
        textAlign: 'center'
    };

    render() {
        const props = this.props;
        const attrs = props.budget.attributes;

        const totalChange = attrs.state.change.actual + attrs.state.change.expected;
        let percentActualChange;
        if (totalChange > 0) {
            percentActualChange = Math.round((attrs.state.change.actual / totalChange) * 100);
        }
        console.log(attrs.state.change.actual / totalChange);
        let incomePercentage;
        if (attrs.state.income.expected) {
            incomePercentage = Math.round(attrs.state.income.actual / attrs.state.income.expected * 100);
            if (incomePercentage > 100) {
                incomePercentage = 100;
            }
        }

        let expensePercentage;
        if (attrs.state.expense.expected) {
            expensePercentage = Math.round(attrs.state.expense.actual / attrs.state.expense.expected * 100);
            if (expensePercentage > 100) {
                expensePercentage = 100;
            }
        }

        let actual_profit = (attrs.outgoing_amount.actual - attrs.incoming_amount).toFixed(2);
        actual_profit = (actual_profit <= 0 ? '' : '+') + actual_profit;
        let expected_profit = (attrs.outgoing_amount.expected - attrs.incoming_amount).toFixed(2);
        expected_profit = (expected_profit <= 0 ? '' : '+') + expected_profit;

        let title = 'Budget for: ' + attrs.term_beginning + ' - ' + attrs.term_end;

        return (
            <div>
                <CardHeader title={title} style={this.cardHeaderStyle}/>
                <CardContent style={this.cardStyle}>
                    <Grid fluid>
                        <Row>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <div>Assets first day: {attrs.incoming_amount.toFixed(2)}</div>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <div style={{'textAlign': 'center'}}>Actual assets last
                                    day: {attrs.outgoing_amount.actual.toFixed(2)} ({actual_profit})</div>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <div style={{'textAlign': 'right'}}>Expected assets last
                                    day: {attrs.outgoing_amount.expected.toFixed(2)} ({expected_profit})</div>
                            </Col>
                        </Row>
                        <Divider variant='middle'/>
                        <Row>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <div>Income</div>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <div style={{'textAlign': 'center'}}>Budget execution</div>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                                <div style={{'textAlign': 'right'}}>Expenses</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}>
                                <div style={{width: '80px', height: '80px'}}>
                                    <SegmentedProgressbar percentage={incomePercentage}/>
                                </div>
                            </Col>
                            <Col xsOffset={9} xs={1} lgOffset={10}>
                                <div style={{width: '80px', height: '80px', textAlign: 'right'}}>
                                    <SegmentedProgressbar percentage={expensePercentage}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <div>{attrs.state.income.actual} of {attrs.state.income.expected}</div>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                <div style={{'textAlign': 'right'}}>{attrs.state.expense.actual} of {attrs.state.expense.expected}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3} sm={2} md={2} lg={2}>
                                Spent today: {attrs.state.change.actual}
                            </Col>
                            <Col xs={6} sm={8} md={8} lg={8}>
                                <Progress percent={percentActualChange}/>
                            </Col>
                            <Col xs={3} sm={2} md={2} lg={2}>
                                <div style={{'textAlign': 'right'}}>Left today: {attrs.state.change.expected}</div>
                            </Col>
                        </Row>
                    </Grid>
                </CardContent>
            </div>
        )
    }
}
