import React, {Component} from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';
import Checkbox from 'material-ui/Checkbox';

export default class BudgetEntry extends Component {
    onExpectedApply() {
        this.props.saveBudgetEntryChange(this.entry);
    }
    onExpectedEdit(ev, value) {
        var attr = {...this.props.entry.attributes};
        attr.expected_amount = value;
        this.entry = {...this.props.entry, attributes: attr};
        console.log(this.entry)
    }

    onEvenEdit(ev, value) {
        var attr = {...this.props.entry.attributes};
        attr.even_distribution = value;
        var entry = {...this.props.entry, attributes: attr};
        this.props.saveBudgetEntryChange(entry);
    }

    onProratedEdit(ev, value) {
        var attr = {...this.props.entry.attributes};
        attr.proration = value;
        var entry = {...this.props.entry, attributes: attr};
        this.props.saveBudgetEntryChange(entry);
    }

    render() {
        var props = this.props;
        this.entry = {...props.entry};
        var attr = this.entry.attributes;

        var progress=0;
        if (attr.expected_amount != 0 ) {
            progress = attr.actual_amount/attr.expected_amount*100;
            if (progress > 100) {
                progress = 100
            }
        }

        var change=<p/>;
        var editable = false;
        if (props.account.attributes.account_type == 'expense') {
            change = <p>{attr.change_amount} allowed</p>;
            editable = true;
        }

        return (
            <Card>
                <CardText actAsExpander={editable}>
                    <Grid fluid>
                        <Row>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                <p>{props.account.attributes.name}</p>
                            </Col>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                {change}
                            </Col>
                            <Col xs={2} sm={2} md={1} lg={1}>
                                <CircularProgress mode='determinate' size={20} value={progress}/>
                            </Col>
                            <Col xs={4} sm={4} md={2} lg={2}>
                                <TextField defaultValue={attr.expected_amount} onBlur={::this.onExpectedApply} onChange={::this.onExpectedEdit}/>
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
                                <Checkbox label='Evenly distributed' checked={attr.even_distribution} onCheck={::this.onEvenEdit}/>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Checkbox label='Prorate spendings' checked={attr.proration} onCheck={::this.onProratedEdit}/>
                            </Col>
                        </Row>
                    </Grid>
                </CardActions>
            </Card>
        )
    }
}
