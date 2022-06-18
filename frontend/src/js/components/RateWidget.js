import React, { Component } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Divider from '@mui/material/Divider'
import ClipLoader from 'react-spinners/ClipLoader'

export default class RateWidget extends Component {
  render () {
    const props = this.props
    if (props.currency.get('error') || props.currency.get('loading')) {
      return <ClipLoader sizeUnit='px' size={80} loading />
    }
    const rates = this.props.rates
      .filter((item) => item.attributes.to_currency === this.props.primaryCurrency)
      .map((item) => {
        const currency = this.props.currency.get('currencies').get(item.attributes.from_currency)
        if (currency) {
          return (
            <ListItem key={'rate' + item.id}><ListItemText
              primary={currency.get('code')}
              secondary={item.attributes.rate}
                                             />
            </ListItem>
          )
        }
        return ''
      })

    return (
      <List>
        <ListSubheader>Currency rates</ListSubheader>
        <Divider />
        {rates}
      </List>
    )
  }
}
