import React, { Component, Fragment } from 'react';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Grid from '@mui/material/Grid';

export default class FinanceOverviewPanel extends Component {

  constructor (props) {
    super(props)
    this.entryId = 0
  }

  renderAsset (props, item) {
    const getCurrency = function (id) {
      const currency = props.currencies.get(parseInt(id))
      if (currency) {
        return currency.get('code');
      }
      return '';
    };

    const getCategory = function (id) {
      const category = props.categoryList.get(id)
      if (category) {
        return category.get('name');
      }
      return 'Unknown asset';
    };

    const primaryCurrencyCode = getCurrency(props.primaryCurrency);

    let details
    if (!(item.totals.length === 1 && item.totals[0].id === props.primaryCurrency)) {
      const detailed = item.totals.map((subitem) => {
        const currencyCode = getCurrency(subitem.id);
        return subitem.value.toFixed(2) + ' ' + currencyCode
      })
      details = <>({detailed.join(', ')})</>
    }

    let color = 'black'
    if (item.primary_balance < 0) {
      color = 'red'
    }

    return (
      <ImageListItem key={this.entryId++}>
        <Grid container spacing={2}>
          <div style={{ fontSize: '0.9em' }}>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <div style={{ textTransform: 'capitalize' }}>{getCategory(item.category_id)}:</div>
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <span style={{ color }}>{item.primary_balance.toFixed(2)}</span> {primaryCurrencyCode}
            </Grid>
            <Grid item xs={7} sm={7} md={7} lg={7}>
              {details}
            </Grid>
          </div>
        </Grid>
      </ImageListItem>
    )
  }

  render () {
    const props = this.props

    const sorted = props.totals.sort((l, r) => {
      const lc = props.categoryList.get(l.category_id)
      if (!lc) {
        return 0
      }

      const rc = props.categoryList.get(r.category_id)
      if (!rc) {
        return 0
      }

      return lc.get('priority') - rc.get('priority')
    })

    const result = sorted.map((item) => this.renderAsset(props, item))

    return (
      <>
        <CardHeader title='Financial status' sx={{
            paddingTop: '0px',
            textAlign: 'center'
        }} />
        <CardContent sx={{
            overflowX: 'hidden',
            overflowY: 'auto'
        }}>
          <ImageList cellHeight={36} cols={1} sx={{
              height: 300
          }}>
            {result}
          </ImageList>
        </CardContent>
      </>
    )
  }
}
