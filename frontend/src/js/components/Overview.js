import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

export default class Overview extends Component {
    render() {
        return (
            <Grid fluid>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card>
                            <CardHeader title="Accounts" subtitle="Balance"/>
                            <CardText>Остатки</CardText>
                            <CardActions>
                                <RaisedButton label="Manage accounts"/>
                                <RaisedButton label="New account"/>
                            </CardActions>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card>
                            <CardHeader title="Состояние"/>
                            <CardText>Состояние</CardText>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card>
                            <CardHeader title="Бюджет"/>
                            <CardText>Бюджет</CardText>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Card>
                            <CardHeader title="Операции"/>
                            <CardText>Операции</CardText>
                        </Card>
                    </Col>
                </Row>
            </Grid>
        )
    }
}
