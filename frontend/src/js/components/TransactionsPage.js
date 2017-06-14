import React, {Component} from 'react';
import {Card, CardHeader, CardActions} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {GridList, GridTile} from 'material-ui/GridList';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';

import Transaction from './Transaction';

export default class OperationsPage extends Component {
    makeAccountsList(props) {
        return props.assetAccounts.concat(props.incomeAccounts, props.expenseAccounts)
    }

    pageSizeChange(event, key, value) {
        this.props.actions.setTransactionPageSize(value);
    }

    loadNextPage() {
        this.props.actions.nextTransactionPage();
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

    render() {
        var props = this.props;

        var accounts = ::this.makeAccountsList(props);

        var buttonStyle = {
            'textDecorationLine': 'underline',
            'textDecorationStyle': 'dashed'
        };

        var title = 'Showing transactions from ' + props.periodBeginning.format('DD-MM-YYYY') + ' till ' + props.periodEnd.format('DD-MM-YYYY');

        var transactions;
        if (props.waiting) {
            transactions = <CircularProgress/>;
        } else if (props.error) {
            transactions = <h1>Unable to load transactions list</h1>
        } else {
            transactions = props.transactions.map(function (item) {
                return (
                    <GridTile key={item.id}><Transaction transaction={item} accounts={accounts}/></GridTile>
                )
            });
        }

        return <div>
            <Card>
                <CardHeader
                    title={title}
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardActions expandable={true}>
                    <Grid fluid>
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
                        </Row>
                    </Grid>
                </CardActions>
            </Card>
            <Divider/>
            <GridList cols={1} cellHeight='auto'>
                <GridTile>
                    <Card>
                        <CardHeader>
                            <Grid>
                                <Row>
                                    <Col xs={1}/>
                                    <Col xs={1}>Date</Col>
                                    <Col xs={3}>Comment</Col>
                                    <Col xs={2}>Amount</Col>
                                    <Col xs={2}>Accounts</Col>
                                    <Col xs={2}>Tags</Col>
                                    <Col xs={1}/>
                                </Row>
                            </Grid>
                        </CardHeader>
                    </Card>
                </GridTile>
                {transactions}
            </GridList>
            <IconButton style={{display: 'block', margin: '0 auto'}} onClick={::this.loadNextPage}><FontIcon className='material-icons' disabled={!props.nextPageAvailable}>file_download</FontIcon></IconButton>
        </div>;
    }
}
