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

export default class TransactionsPageFilter extends Component {
    makeAccountsList(props) {
        return props.assetAccounts.concat(props.incomeAccounts, props.expenseAccounts)
    }

    pageSizeChange(ev) {
        this.props.actions.setTransactionPageSize(ev.target.value);
    }

    setPeriodDays(days) {
        this.props.actions.setTransactionViewPeriod(days)
    }

    setBeginning(value) {
        this.props.actions.setTransactionViewBeginning(value)
    }

    setEnd(value) {
        this.props.actions.setTransactionViewEnd(value)
    }

    setFilterAccounts(ev) {
        this.props.actions.setTransactionFilterAccount(ev.target.value)
    }

    setFilterTags(ev) {
        this.props.actions.setTransactionFilterTag(ev.target.value)
    }

    setFilterComment(ev) {
        this.props.actions.setTransactionFilterComment(ev.target.value)
    }

    clearFilter() {
        this.props.actions.transactionFilterClear()
    }

    applyFilter() {
        this.props.actions.transactionFilterApply()
    }

    render() {
        var props = this.props;

        //var accounts = ::this.makeAccountsList(props);

        var buttonStyle = {
            'textDecorationLine': 'underline',
            'textDecorationStyle': 'dashed'
        };

        /*var accountItems = accounts.map((acc) => {
            return <MenuItem key={acc.id} value={acc.id}>
              <Checkbox checked={props.accountFilter.indexOf(acc.id) > -1} />
              <ListItemText primary={acc.attributes.name}/>
            </MenuItem>
        });*/

        var tagItems = props.tags.map((tag) => {
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
              <DatePicker value={props.periodBeginning.toDate()} onChange={::this.setBeginning}/>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
                Period end
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              <DatePicker value={props.periodEnd.toDate()} onChange={::this.setEnd}/>
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
                              onChange={::this.pageSizeChange}
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
                  <TextField label='Comment contains...' onChange={::this.setFilterComment}
                             value={props.commentFilter}/>
                </FormControl>
              </Col>
            </Row>
            <Row>
                <Col xs={6} sm={6} md={6} lg={6}>
                  <FormControl fullWidth={true}>
                      <InputLabel htmlFor={'accounts-filter'}>Select accounts</InputLabel>
                      <Select multiple={true}
                              value={props.accountFilter}
                              onChange={::this.setFilterAccounts}
                              inputProps={{id: 'accounts-filter'}}
                              renderValue={() => 'r'/*selected => selected.map((item) => accounts.filter((acc) => acc.id == item)[0].attributes.name+';')*/}>
                              {/*accountItems*/}
                      </Select>
                  </FormControl>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  <FormControl fullWidth={true}>
                      <InputLabel htmlFor={'tags-filter'}>Select tags</InputLabel>
                      <Select multiple={true}
                              value={props.tagFilter.toJS()}
                              onChange={::this.setFilterTags}
                              inputProps={{id: 'tags-filter'}}
                              renderValue={selected => selected.map((item) => item+',')}>>
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
