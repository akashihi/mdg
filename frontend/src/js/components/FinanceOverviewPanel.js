import React, {Component, Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {Grid, Row, Col} from 'react-flexbox-grid';

const styles = {
  content: {
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  panel: {
    height: 300
  }
};


class FinanceOverviewPanel extends Component {

    renderAsset(props, item) {
      var getCurrency = function(id) {
          const currency = props.currencies.find((v, k) => id == k);
          if (currency) {
            return currency.get('code');
          }
          return '';
      };


      var primaryCurrencyCode = getCurrency(props.primaryCurrency)

      if (!(item.totals.length == 1 && item.totals[0].currency_id == props.primaryCurrency)) {
        var detailed = item.totals.map((subitem) => {
          var currencyCode = getCurrency(subitem.currency_id)
          return subitem.balance.toFixed(2)+' '+currencyCode
        })
        var details = <Fragment>({detailed.join(', ')})</Fragment>
      }

      var color = 'black'
      if (item.primary_balance < 0) {
        color = 'red'
      }

      return (
          <GridListTile>
            <Grid fluid>
              <Row>
                <Col xs={2} sm={2} md={2} lg={2}>
                  <div style={{'text-transform': 'capitalize'}}>{item.asset_type}:</div>
                </Col>
                <Col xs={3} sm={3} md={3} lg={3}>
                  <span style={{color: color}}>{item.primary_balance.toFixed(2)}</span> {primaryCurrencyCode}
                </Col>
                <Col xs={7} sm={7} md={7} lg={7}>
                  {details}
                </Col>
              </Row>
            </Grid>
          </GridListTile>
      )
    }

    render() {
        var props = this.props;

        var sorted = props.totals.sort((l, r) => {
          var typesInOrder = ['cash', 'current', 'savings', 'deposit', 'credit', 'debt', 'broker', 'tradable']
          return typesInOrder.indexOf(l.asset_type) - typesInOrder.indexOf(r.asset_type)
        })

        var result = sorted.map((item) => this.renderAsset(props, item))

        return (
            <Fragment>
                <CardHeader title='Financial status'/>
                  <CardContent className={this.props.classes.content}>
                    <GridList cellHeight={30} cols={1} className={this.props.classes.panel}>
                        {result}
                    </GridList>
                  </CardContent>
            </Fragment>
        )
    }
}

export default withStyles(styles)(FinanceOverviewPanel)
