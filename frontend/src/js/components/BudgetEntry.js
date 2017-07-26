import React, {Component} from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';

export default class BudgetEntry extends Component {
    render() {
        var props = this.props;
        var entry = props.entry;
        var attr = entry.attributes;

        var progress=0;
        if (attr.expected_amount != 0 ) {
            progress = attr.actual_amount/attr.expected_amount*100
            if (progress > 100) {
                progress = 100
            }
        }

        return (
            <Card>
                <CardText actAsExpander={true}>
                    <Grid fluid>
                        <Row>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                <p>{props.account.attributes.name}</p>
                            </Col>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                <p>{attr.change_amount} allowed</p>
                            </Col>
                            <Col xs={2} sm={2} md={1} lg={1}>
                                <CircularProgress mode='determinate' size={20} value={progress}/>
                            </Col>
                            <Col xs={4} sm={4} md={2} lg={2}>
                                <TextField defaultValue={attr.expected_amount}/>
                            </Col>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                <p>{attr.actual_amount}</p>
                            </Col>
                        </Row>
                    </Grid>
                </CardText>
                <CardActions expandable={true}>
                    <Grid fluid>
                        <Row>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Checkbox label='Evenly distributed' checked={attr.even_distribution}/>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Checkbox label='Prorate spendings' checked={attr.prorated}/>
                            </Col>
                        </Row>
                    </Grid>
                </CardActions>
            </Card>
        )
    }
}
