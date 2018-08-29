import React, {Component} from 'react';
import {Card, CardText} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
            <MenuItem value={item.id} key={item.id} primaryText={item.attributes.name}/>
        )
    });

    return (
      <Card>
        <CardText>
          <Grid fluid>
            <Row>
              <Col xs={6} sm={6} md={4} lg={4}>
                <p>Primary currency:</p>
              </Col>
              <Col xs={6} sm={6} md={4} lg={4}>
                <SelectField hintText='Select currency'
                           value={props.primaryCurrency}
                           onChange={(ev, key, value) => ::this.onPrimaryCurrencyChange(value)}
                           >
                           {currencies}
                  </SelectField>
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
      </CardText>
    </Card>
  )
  }
}
