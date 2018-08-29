import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ClipLoader from 'react-spinners/ClipLoader';
import Checkbox from '@material-ui/core/Checkbox';

export default class SettingsPage extends Component {
  onPrimaryCurrencyChange(value) {
      this.props.actions.setPrimaryCurrency(value);
  }

  onCloseTransactionDialogChange(value) {
    this.props.actions.setCloseTransactionDialog(value);
  }

  render() {
    var props = this.props;

    if (props.waiting) {
      return (<ClipLoader sizeUnit={'px'} size={150} loading={true}/>)
    }
    if (props.error) {
      return (<h1>Unable to load settings</h1>)
    }

    var currencies = props.currencies.map(function (item) {
        return (
            <MenuItem value={item.id} key={item.id}>{item.attributes.name}</MenuItem>
        )
    });

    return (
          <Grid fluid>
            <Row>
              <Col xs={6} sm={6} md={4} lg={4}>
                <p>Primary currency:</p>
              </Col>
              <Col xs={6} sm={6} md={4} lg={4}>
                <Select
                           value={props.primaryCurrency}
                           onChange={(ev) => ::this.onPrimaryCurrencyChange(ev.target.value)}
                           >
                           {currencies}
                  </Select>
              </Col>
            </Row>
            <Row>
              <Col xs={6} sm={6} md={4} lg={4}>
                <p>By default close transaction dialog:</p>
              </Col>
              <Col xs={6} sm={6} md={4} lg={4}>
                <Checkbox value={this.props.closeTransactionDialog} onChange={(ev, value) => ::this.onCloseTransactionDialogChange(value)}/>
              </Col>
            </Row>
        </Grid>
  )
  }
}
