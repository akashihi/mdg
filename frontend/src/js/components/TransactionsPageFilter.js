import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';

export default class TransactionsPageFilter extends Component {
    makeAccountsList(props) {
        return props.assetAccounts.concat(props.incomeAccounts, props.expenseAccounts)
    }

    pageSizeChange(event, key, value) {
        this.props.actions.setTransactionPageSize(value);
    }

    setPeriodDays(days) {
        this.props.actions.setTransactionViewPeriod(days)
    }

    setBeginning(ev ,value) {
        this.props.actions.setTransactionViewBeginning(value)
    }

    setEnd(ev, value) {
        this.props.actions.setTransactionViewEnd(value)
    }

    setFilterAccounts(ev, key, values) {
        this.props.actions.setTransactionFilterAccount(values)
    }

    render() {
        var props = this.props;

        var accounts = ::this.makeAccountsList(props);

        var buttonStyle = {
            'textDecorationLine': 'underline',
            'textDecorationStyle': 'dashed'
        };

        var accountItems = accounts.map((acc) => {
            return <MenuItem
                key={acc.id}
                insetChildren={true}
                checked={props.accountFilter.indexOf(acc.id) > -1}
                value={acc.id}
                primaryText={acc.attributes.name}
            />
        });

        return <Grid fluid>
            <Row>
                <Col xs={6} sm={6} md={4} lg={4}>
                    <FlatButton label='Today' style={buttonStyle} onClick={() => ::this.setPeriodDays(0)}/>
                    <FlatButton label='Week' style={buttonStyle} onClick={() => ::this.setPeriodDays(7)}/>
                    <FlatButton label='Month' style={buttonStyle} onClick={() => ::this.setPeriodDays(30)}/>
                    <FlatButton label='Three months' style={buttonStyle} onClick={() => ::this.setPeriodDays(90)}/>
                    <FlatButton label='Year' style={buttonStyle} onClick={() => ::this.setPeriodDays(365)}/>
                </Col>
                <Col xs={6} sm={6} md={2} mdOffset={6} lg={2} lgOffset={6}>
                    <SelectField floatingLabelText='Transactions on page:' value={props.pageSize} onChange={::this.pageSizeChange}>
                        <MenuItem value={10} primaryText='10'/>
                        <MenuItem value={25} primaryText='20'/>
                        <MenuItem value={50} primaryText='50'/>
                        <MenuItem value={100} primaryText='100'/>
                        <MenuItem value={250} primaryText='250'/>
                        <MenuItem value={500} primaryText='500'/>
                    </SelectField>
                </Col>
            </Row>
            <Row>
                <Col xs={6} sm={6} md={2} lg={2}>
                    <DatePicker container='inline' hintText='Period beginning' value={props.periodBeginning.toDate()} onChange={::this.setBeginning}/>
                    <DatePicker container='inline' hintText='Period end' value={props.periodEnd.toDate()} onChange={::this.setEnd}/>
                </Col>
                <Col xs={2} sm={2} md={3} mdOffset={1} lg={3} lgOffset={1}>
                    Comment filter
                </Col>
                <Col xs={2} sm={2} md={3} lg={3}>
                    <SelectField
                        multiple={true}
                        hintText='Select accounts'
                        value={props.accountFilter}
                        onChange={::this.setFilterAccounts}
                    >
                        {accountItems}
                    </SelectField>
                </Col>
                <Col xs={2} sm={2} md={3} lg={3}>
                    Tags filter
                </Col>
            </Row>
        </Grid>;
    }
}
