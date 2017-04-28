import React, {Component} from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';

export default class BudgetEntry extends Component {
    render() {
        return (
            <Card>
                <CardText actAsExpander={true}>
                    <Grid fluid>
                        <Row>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                <p>Account</p>
                            </Col>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                <p>330 allowed</p>
                            </Col>
                            <Col xs={2} sm={2} md={1} lg={1}>
                                <CircularProgress mode='determinate' size={20} value={70}/>
                            </Col>
                            <Col xs={4} sm={4} md={2} lg={2}>
                                <TextField defaultValue='actual'/>
                            </Col>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                <p>expected</p>
                            </Col>
                        </Row>
                    </Grid>
                </CardText>
                <CardActions expandable={true}>
                    <Grid fluid>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Checkbox label='Evenly distributed'/>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Checkbox label='Prorate spendings'/>
                            </Col>
                        </Row>
                    </Grid>
                </CardActions>
            </Card>
        )
    }
}
