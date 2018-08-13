import React, {Component} from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SegmentedProgressbar from '../widgets/SegmentedProgressbar'
//import Checkbox from 'material-ui/Checkbox';

export default class BudgetEntry extends Component {
    onExpectedApply() {
        this.props.saveBudgetEntryChange(this.entry);
    }
    onExpectedEdit(ev, value) {
        var attr = {...this.props.entry.attributes};
        attr.expected_amount = value;
        this.entry = {...this.props.entry, attributes: attr};
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
            progress = Math.round(attr.actual_amount/attr.expected_amount*100);
            if (progress > 100) {
                progress = 100
            }
        } else if (attr.actual_amount > 0) {
            progress = 100
        }

        var change=<p/>;
        var editable = attr.account_type == 'expense'
        if (editable && attr.change_amount) {
            change = <p>{attr.change_amount} allowed</p>;
        }

        return (
            <Card>
                <CardText actAsExpander={editable}>
                    <Grid fluid>
                        <Row>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                <p>{attr.account_name}&nbsp;({props.currency.attributes.name})</p>
                            </Col>
                            <Col xs={6} sm={6} md={3} lg={3}>
                                {change}
                            </Col>
                            <Col xs={2} sm={2} md={1} lg={1}>
                              <div style={{ width: '60px', height: '60px' }}>
                                <SegmentedProgressbar percentage={progress}/>
                              </div>
                            </Col>
                            <Col xs={4} sm={4} md={2} lg={2}>
                                <TextField id={'budgetentry'+this.entry.id} defaultValue={attr.expected_amount} onBlur={::this.onExpectedApply} onChange={::this.onExpectedEdit}/>
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
                                {/*<Checkbox label='Evenly distributed' checked={attr.even_distribution} onCheck={::this.onEvenEdit}/>*/}
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                {/*<Checkbox label='Prorate spendings' checked={attr.proration} onCheck={::this.onProratedEdit} disabled={!attr.even_distribution}/>*/}
                            </Col>
                        </Row>
                    </Grid>
                </CardActions>
            </Card>
        )
    }
}
