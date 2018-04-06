import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export default class RateWidget extends Component {

  render() {
    var rates = this.props.rates
    .filter((item) => item.attributes.to_currency == this.props.primaryCurrency)
    .map((item) => {
      var currencyCode = this.props.currencies.filter((currency) => currency.id == item.attributes.from_currency)
      .map((currency) => currency.attributes.code)

      return <ListItem key={'rate'+item.id} primaryText={currencyCode} secondaryText={item.attributes.rate}/>
    })

    return (
      <List>
        <Subheader>Currency rates</Subheader>
        <Divider/>
        {rates}
      </List>
    )
  }
}
