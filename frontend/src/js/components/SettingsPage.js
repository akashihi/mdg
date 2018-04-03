import React, {Component} from 'react';
import {Card, CardText} from 'material-ui/Card';
import {Grid, Row, Col} from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

export default class SettingsPage extends Component {
  componentDidMount() {
      this.props.actions.loadSettingList()
  }

  onPrimaryCurrencyChange(value) {
      this.props.actions.setPrimaryCurrency(value);
  }

  render() {
    var props = this.props;

    if (props.waiting) {
      return (<CircularProgress/>)
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
        </Grid>
      </CardText>
    </Card>
  )
  }
}
