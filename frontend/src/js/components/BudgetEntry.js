import React, {Component, Fragment} from 'react';
import TextField from '@material-ui/core/TextField';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SegmentedProgressbar from '../widgets/SegmentedProgressbar'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class BudgetEntry extends Component {
    onExpectedApply() {
        this.props.saveBudgetEntryChange(this.entry);
    }

    onExpectedEdit(ev) {
        var value = ev.target.value;
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

        var progress = 0;
        if (attr.expected_amount !== 0) {
            progress = Math.round(attr.actual_amount / attr.expected_amount * 100);
            if (progress > 100) {
                progress = 100
            }
        } else if (attr.actual_amount > 0) {
            progress = 100
        }

        var entry_color;
        var color_progress = progress;
        if (attr.account_type === 'income') {
            color_progress = 1/color_progress;
        }
        if (color_progress >= 95) {
            entry_color = 'red'
        } else if (color_progress >= 80) {
            entry_color = 'orange'
        } else {
            entry_color = 'lime'
        }

        var change = <p/>;
        var editors = <p/>;
        if (attr.account_type === 'expense') {
            editors = (
                <Fragment>
                    <Col xs={12} sm={12} md={6} lg={1}>
                        <FormControlLabel control={<Checkbox color='primary' checked={attr.even_distribution} onChange={::this.onEvenEdit}/>} label={'Evenly distributed'}/>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={1}>
                        <FormControlLabel control={<Checkbox color='primary' checked={attr.proration} onChange={::this.onProratedEdit} disabled={!attr.even_distribution}/>} label={'Prorate spendings'}/>
                    </Col>
                </Fragment>
            );
            if (attr.change_amount) {
                change = <p>{attr.change_amount} allowed</p>;
            }
        }

        return (
            <Grid fluid>
                <Row>
                    <Col xs={6} sm={6} md={3} lg={3}>
                        <p>{attr.account_name}&nbsp;({props.currency.get('name')})</p>
                    </Col>
                    <Col xs={6} sm={6} md={3} lg={3}>
                        {change}
                    </Col>
                    <Col xs={2} sm={2} md={1} lg={1}>
                        <div style={{width: '60px', height: '60px'}}>
                            <SegmentedProgressbar percentage={progress} color={entry_color}/>
                        </div>
                    </Col>
                    <Col xs={4} sm={4} md={2} lg={2}>
                        <TextField id={'budgetentry' + this.entry.id} defaultValue={attr.expected_amount}
                                   onBlur={::this.onExpectedApply} onChange={::this.onExpectedEdit}/>
                    </Col>
                    <Col xs={6} sm={6} md={3} lg={1}>
                        <p>{attr.actual_amount}</p>
                    </Col>
                    {editors}
                </Row>
            </Grid>
        )
    }
}
