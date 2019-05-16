import React, {Component, Fragment} from 'react';
import TextField from '@material-ui/core/TextField';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SegmentedProgressbar from '../widgets/SegmentedProgressbar'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ClipLoader from 'react-spinners/ClipLoader';

export default class BudgetEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {entry: props.entry}
    }
    onSave() {
        this.setState({entry: this.state.entry.set('loading', true)}); //We need to set it here, cause global setter will not update instance state.
        this.props.saveBudgetEntryChange(this.props.id, this.state.entry);
    }

    onEdit(field, value, shouldSave) {
        this.setState({entry: this.state.entry.set(field, value)});
        if (shouldSave) {
            ::this.onSave()
        }
    }

    render() {
        const props = this.props;
        const entry = this.state.entry;

        if (entry.get('loading')) {
            // Fast processing
            return <ClipLoader sizeUnit={'px'} size={15} loading={true}/>
        }


        let progress = 0;
        if (entry.get('expected_amount') !== 0) {
            progress = Math.round(entry.get('actual_amount') / entry.get('expected_amount') * 100);
            if (progress > 100) {
                progress = 100
            }
        } else if (entry.get('actual_amount') > 0) {
            progress = 100
        }

        let entry_color;
        let color_progress = progress;
        if (entry.get('account_type') === 'income') {
            color_progress = 1/color_progress;
        }
        if (color_progress >= 95) {
            entry_color = 'red'
        } else if (color_progress >= 80) {
            entry_color = 'orange'
        } else {
            entry_color = 'lime'
        }

        let change = <div/>;
        let editors = <div/>;
        if (entry.get('account_type') === 'expense') {
            editors = (
                <Fragment>
                    <Col xsOffset={5} xs={3} smOffset={5} sm={3} mdOffset={6} md={3} lgOffset={1} lg={1}>
                        <FormControlLabel control={<Checkbox color='primary' checked={entry.get('even_distribution')} onChange={(ev, value) => ::this.onEdit('even_distribution', value, true)}/>} label={'Evenly distributed'}/>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={1}>
                        <FormControlLabel control={<Checkbox color='primary' checked={entry.get('proration')} onChange={(ev, value) => ::this.onEdit('proration', value, true)} disabled={!entry.get('even_distribution')}/>} label={'Prorate spendings'}/>
                    </Col>
                </Fragment>
            );
            if (entry.get('change_amount')) {
                change = <div>{entry.get('change_amount')} allowed</div>;
            }
        }

        return (
            <Grid fluid>
                <Row style={{paddingBottom:'8px'}}>
                    <Col xs={3} sm={3} md={4} lg={3}>
                        <div>{entry.get('account_name')}&nbsp;({props.currency.get('name')})</div>
                    </Col>
                    <Col xs={3} sm={3} md={2} lg={1}>
                        {change}
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={1}>
                        <div style={{width: '60px', height: '60px'}}>
                            <SegmentedProgressbar percentage={progress} color={entry_color}/>
                        </div>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2}>
                        <TextField id={'budgetentry' + props.id} defaultValue={entry.get('expected_amount')} type='number'
                                   onBlur={::this.onSave} onChange={(ev) => ::this.onEdit('expected_amount', ev.target.value, false)}/>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={1}>
                        <div>{entry.get('actual_amount')}</div>
                    </Col>
                    {editors}
                </Row>
            </Grid>
        )
    }
}
