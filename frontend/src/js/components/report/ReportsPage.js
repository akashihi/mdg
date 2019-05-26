import React, {Component, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DatePicker from 'react-date-picker'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {Grid, Row, Col} from 'react-flexbox-grid';

import AssetReportCollection from './AssetReportCollection'
import BudgetExecutionReport from '../budget/BudgetExecutionReport'
import IncomeReportCollection from './IncomeReportCollection'
import ExpenseReportCollection from './ExpenseReportCollection'

export default class ReportsPage extends Component {
    state = { tabValue: 'asset' };

    switchTab(ev, value) {
        this.setState({
            tabValue: value,
        });
    }

    render() {
      const props = this.props;


      let primaryCurrencyName = 'Amount';
      if (props.currencies.has(props.primaryCurrency)) {
        primaryCurrencyName = props.currencies.get(props.primaryCurrency).get('name');
      }


        return (
          <Fragment>
            <Grid fluid>
              <Row>
                <Col xs={6} sm={6} md={2} lg={2}>Report start date</Col>
                <Col xs={6} sm={6} md={3} lg={3}><DatePicker value={props.startDate.toDate()} onChange={props.actions.setReportStartDate}/></Col>
                <Col xs={6} sm={6} md={2} lg={2}>Report last date</Col>
                <Col xs={6} sm={6} md={3} lg={3}><DatePicker value={props.endDate.toDate()} onChange={props.actions.setReportEndDate}/></Col>
                <Col xs={6} sm={6} md={2} lg={2}>
                  <FormControl fullWidth={true}>
                    <InputLabel htmlFor={'granularity'}>Granularity</InputLabel>
                    <Select value={props.granularity}
                            onChange={(ev) => props.actions.setReportGranularity(ev.target.value)}
                            inputProps={{id: 'granularity'}}>
                            <MenuItem value={1}>1 day</MenuItem>
                            <MenuItem value={7}>Week</MenuItem>
                            <MenuItem value={14}>2 weeks</MenuItem>
                            <MenuItem value={30}>Month</MenuItem>
                            <MenuItem value={92}>3 months</MenuItem>
                            <MenuItem value={365}>Year</MenuItem>
                    </Select>
                  </FormControl>
                </Col>
              </Row>
            </Grid>

            <Tabs value={this.state.tabValue} onChange={::this.switchTab} centered variant={'fullWidth'}>
                <Tab label='Asset report' value='asset'/>
                <Tab label='Budget report' value='budget'/>
                <Tab label='Incomes report' value='income'/>
                <Tab label='Expenses report' value='expenses'/>
            </Tabs>
            {this.state.tabValue == 'asset' && <AssetReportCollection currencyName={primaryCurrencyName} actions={props.actions} simpleAssetReport={props.simpleAssetReport} currencyAssetReport={props.assetReportCurrency} assetReportType={props.assetReportType}/>}
            {this.state.tabValue == 'budget' && <BudgetExecutionReport currencyName={primaryCurrencyName} budgetExecution={props.budgetExecution}/>}
            {this.state.tabValue == 'income' && <IncomeReportCollection currencyName={primaryCurrencyName} actions={props.actions} incomeByAccount={props.incomeByAccount} incomeByAccountWeight={props.incomeByAccountWeight}/>}
            {this.state.tabValue == 'expenses' && <ExpenseReportCollection currencyName={primaryCurrencyName} actions={props.actions} expenseByAccount={props.expenseByAccount} expenseByAccountWeight={props.expenseByAccountWeight}/>}
          </Fragment>
        );
    }
}
