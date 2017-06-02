import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Checkbox from 'material-ui/Checkbox';

export default class Transaction extends Component {
    render() {
        return <Card>
            <CardHeader
                actAsExpander={false}
                showExpandableButton={true}>
                <Grid>
                    <Row>
                        <Col xs={1}><Checkbox/></Col>
                        <Col xs={1}>2017-31-05</Col>
                        <Col xs={3}>Blackjack and hookers</Col>
                        <Col xs={2}>
                            <div style={{color: 'red'}}> -100500</div>
                        </Col>
                        <Col xs={2}>Asset, Rent</Col>
                        <Col xs={2}>Black jack, Hookers, Usd</Col>
                        <Col xs={1}>Actions</Col>
                    </Row>
                </Grid>
            </CardHeader>
            <CardText expandable={true}>
                <Grid>
                    <Row>
                        <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                        <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                    </Row>
                    <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                    <Row>
                        <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                        <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                    </Row>
                    <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                    <Row>
                        <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Account:</Col>
                        <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                    </Row>
                    <Row><Col xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider/></Col></Row>
                    <Row><Col xs={12} sm={12} mdOffset={6} md={6} lgOffset={6} lg={6}><Divider/></Col></Row>
                    <Row>
                        <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Earned:</Col>
                        <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                    </Row>
                    <Row>
                        <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Kept:</Col>
                        <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                    </Row>
                    <Row>
                        <Col xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>Spent:</Col>
                        <Col xs={6} sm={6} md={2} lg={2}>Amount</Col>
                    </Row>
                </Grid>
            </CardText>
        </Card>;
    }
}
