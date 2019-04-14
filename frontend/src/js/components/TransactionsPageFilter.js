import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DatePicker from 'react-date-picker'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Done from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import Divider from '@material-ui/core/Divider';
import {List} from 'immutable';
import moment from 'moment';

import {filterNonListedCategories} from '../util/AccountUtils'

export default class TransactionsPageFilter extends Component {

    setPeriodDays(days) {
        this.props.actions.setTransactionFilter('periodBeginning', moment().subtract(days, 'days'), false);
        this.props.actions.setTransactionFilter('periodEnds', moment(), false);
        this.props.actions.setTransactionFilter('pageNumber', 1, true);
    }

    clearFilter() {
        this.props.actions.transactionFilterClear()
    }

    applyFilter() {
        this.props.actions.transactionFilterApply()
    }

    mapAccountEntry(acc, id) {
        const props = this.props;
        return <MenuItem key={id} value={id}>
            <Checkbox checked={props.accountFilter.indexOf(acc.id) > -1} />
            <ListItemText primary={acc.get('name')}/>
        </MenuItem>
    }

    renderCategorizedList(accounts, categoryList) {
        const ths = this;
        var entries = [];

        const mapEntry = function(category, prefix) {
            const prepend = '-'.repeat(prefix);
            const entry = <ListItemText key={'category-'+category.get('id')} primary={prepend+category.get('name')}/>;
            entries.push(entry);

            //If we have related accounts - add them
            const category_accounts = accounts.filter((item) => item.get('category_id') === category.get('id')).map(::ths.mapAccountEntry);
            entries = entries.concat(category_accounts.valueSeq().toJS());

            if (category.has('children')) {
                category.get('children').forEach((item) => mapEntry(item, prefix+1))
            }
        };

        categoryList.forEach((item) => mapEntry(item, 0));

        return entries
    }

    categorizeAccounts(type) {
        const props = this.props;
        var result = [];

        const filtered_accounts = props.accounts.filter((item) => !item.get('hidden'));

        const accounts = filtered_accounts.filter(item => item.get('account_type') === type);
        const categories_ids = accounts.map((item) => item.get('category_id')).valueSeq();
        const categories = filterNonListedCategories(categories_ids, props.categories);
        result = result.concat(this.renderCategorizedList(accounts, categories));
        result.push(<Divider key={'noncategorized-divider-'+type}/>);
        result = result.concat(accounts.filter((item) => !item.get('category_id')).map(::this.mapAccountEntry).valueSeq().toJS());

        return result
    }

    renderAccounts() {
        const props = this.props;

        var result = [];

        //First asset accounts are manually categorized and rendered
        result.push(<ListSubheader key='asset-header'>Asset accounts</ListSubheader>);
        result.push(<Divider key='asset-divider'/>);

        const filtered_accounts = props.accounts.filter((item) => !item.get('hidden'));

        result.push(<ListItemText key='asset-cash' primary='Cash'/>);
        result = result.concat(filtered_accounts.filter((item) => item.get('asset_type') === 'cash').map(::this.mapAccountEntry).valueSeq().toJS());
        result.push(<ListItemText key='asset-current' primary='Current'/>);
        result = result.concat(filtered_accounts.filter((item) => item.get('asset_type') === 'current').map(::this.mapAccountEntry).valueSeq().toJS());
        result.push(<ListItemText key='asset-savings' primary='Savings'/>);
        result = result.concat(filtered_accounts.filter((item) => item.get('asset_type') === 'savings').map(::this.mapAccountEntry).valueSeq().toJS());
        result.push(<ListItemText key='asset-deposit' primary='Deposit'/>);
        result = result.concat(filtered_accounts.filter((item) => item.get('asset_type') === 'deposit').map(::this.mapAccountEntry).valueSeq().toJS());
        result.push(<ListItemText key='asset-credit' primary='Credit'/>);
        result = result.concat(filtered_accounts.filter((item) => item.get('asset_type') === 'credit').map(::this.mapAccountEntry).valueSeq().toJS());
        result.push(<ListItemText key='asset-debt' primary='Debt'/>);
        result = result.concat(filtered_accounts.filter((item) => item.get('asset_type') === 'debt').map(::this.mapAccountEntry).valueSeq().toJS());
        result.push(<ListItemText key='asset-broker' primary='Broker'/>);
        result = result.concat(filtered_accounts.filter((item) => item.get('asset_type') === 'broker').map(::this.mapAccountEntry).valueSeq().toJS());
        result.push(<ListItemText key='asset-tradable' primary='Tradable'/>);
        result = result.concat(filtered_accounts.filter((item) => item.get('asset_type') === 'tradable').map(::this.mapAccountEntry).valueSeq().toJS());

        //Categorized expenses go next
        result.push(<ListSubheader key='expense-header'>Expense accounts</ListSubheader>);
        result.push(<Divider key='expense-divider'/>);
        result = result.concat(this.categorizeAccounts('expense'));

        //Finally categorized incomes
        result.push(<ListSubheader key='income-header'>Income accounts</ListSubheader>);
        result.push(<Divider key='income-divider'/>);
        result = result.concat(this.categorizeAccounts('income'));

        return result;
    }

    render() {
        var props = this.props;
        const edit = this.props.actions.setTransactionFilter;

        var buttonStyle = {
            'textDecorationLine': 'underline',
            'textDecorationStyle': 'dashed'
        };

        const accountItems = this.renderAccounts();

        const tagItems = props.tags.map((tag) => {
            return <MenuItem key={tag.get('txtag')} value={tag.get('txtag')}>
              <Checkbox checked={props.tagFilter.indexOf(tag.get('txtag')) > -1}/>
              <ListItemText primary={tag.get('txtag')}/>
            </MenuItem>
        }).valueSeq();

        return <Grid fluid  style={{'height': '340px'}}>
          <Row>
            <Col xs={6} sm={6} md={6} lg={6}>
                Period beginning
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              <DatePicker value={props.periodBeginning.toDate()} onChange={(v) => edit('periodBeginning', moment(v), false)}/>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
                Period end
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              <DatePicker value={props.periodEnd.toDate()} onChange={(v) => edit('periodEnd', moment(v), false)}/>
            </Col>
          </Row>
            <Row>
                <Col xs={12} sm={6} md={6} lg={6}>
                    <Button variant='text' style={buttonStyle} onClick={() => ::this.setPeriodDays(0)}>Today</Button>
                    <Button variant='text' style={buttonStyle} onClick={() => ::this.setPeriodDays(7)}>Week</Button>
                    <Button variant='text' style={buttonStyle} onClick={() => ::this.setPeriodDays(30)}>Month</Button>
                    <Button variant='text' style={buttonStyle} onClick={() => ::this.setPeriodDays(90)}>Three months</Button>
                    <Button variant='text' style={buttonStyle} onClick={() => ::this.setPeriodDays(365)}>Year</Button>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <FormControl fullWidth={true}>
                      <InputLabel htmlFor={'tx-on-page'}>Transactions on page</InputLabel>
                      <Select value={props.pageSize}
                              onChange={(ev) => edit('pageSize', ev.target.value, true)}
                              inputProps={{id: 'tx-on-page'}}>
                              <MenuItem value={10}>10</MenuItem>
                              <MenuItem value={25}>25</MenuItem>
                              <MenuItem value={50}>50</MenuItem>
                              <MenuItem value={100}>100</MenuItem>
                              <MenuItem value={250}>250</MenuItem>
                              <MenuItem value={500}>500</MenuItem>
                      </Select>
                  </FormControl>
                </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <FormControl fullWidth={true}>
                  <TextField label='Comment contains...' onChange={(ev) => edit('commentFilter', ev.target.value, false)}
                             value={props.commentFilter}/>
                </FormControl>
              </Col>
            </Row>
            <Row>
                <Col xs={6} sm={6} md={6} lg={6}>
                  <FormControl fullWidth={true}>
                      <InputLabel htmlFor={'accounts-filter'}>Select accounts</InputLabel>
                      <Select multiple={true}
                              value={props.accountFilter.toJS()}
                              onChange={(ev) => edit('accountFilter', List(ev.target.value), false)}
                              inputProps={{id: 'accounts-filter'}}
                              renderValue={() => 'r'/*selected => selected.map((item) => accounts.filter((acc) => acc.id == item)[0].attributes.name+';')*/}>
                              {accountItems}
                      </Select>
                  </FormControl>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  <FormControl fullWidth={true}>
                      <InputLabel htmlFor={'tags-filter'}>Select tags</InputLabel>
                      <Select multiple={true}
                              value={props.tagFilter.toJS()}
                              onChange={(ev) => edit('tagFilter', List(ev.target.value), false)}
                              inputProps={{id: 'tags-filter'}}
                              renderValue={selected => selected.join(',')}>>
                              {tagItems}
                      </Select>
                  </FormControl>
                </Col>
            </Row>
            <Row>
              <Col xsOffset={8} xs={4} smOffset={8} sm={4} mdOffset={8} md={4} lgOffset={8} lg={4}>
                <Button aria-label='Done' onClick={::this.applyFilter}><Done/></Button>
                <Button aria-label='Clear' onClick={::this.clearFilter}><Clear/></Button>
              </Col>
            </Row>
        </Grid>;
    }
}
