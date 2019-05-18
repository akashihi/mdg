import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DatePicker from 'react-date-picker'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Done from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import {List} from 'immutable';
import moment from 'moment';

import {AccountMapper} from '../../util/AccountUtils'

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

    render() {
        var props = this.props;
        const edit = this.props.actions.setTransactionFilter;

        var buttonStyle = {
            'textDecorationLine': 'underline',
            'textDecorationStyle': 'dashed'
        };

        const accountItems = new AccountMapper(props.currencies, props.categories, props.accounts).getAccounts();

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
                              renderValue={selected => selected.map((item) => props.accounts.get(item).get('name')).join(';')}>
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
