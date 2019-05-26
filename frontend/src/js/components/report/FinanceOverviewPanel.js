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

    cardHeaderStyle = {
        paddingTop: '0px',
        textAlign: 'center'
    };

    constructor(props) {
        super(props);
        this.entryId = 0;
    }

    renderAsset(props, item) {

      const getCurrency = function(id) {
          const currency = props.currencies.get(id);
          if (currency) {
            return currency.get('code');
          }
          return '';
      };


      const primaryCurrencyCode = getCurrency(props.primaryCurrency);

      let details;
      if (!(item.totals.length === 1 && item.totals[0].id === props.primaryCurrency)) {
        const detailed = item.totals.map((subitem) => {
          const currencyCode = getCurrency(subitem.id);
          return subitem.value.toFixed(2)+' '+currencyCode
        });
        details = <Fragment>({detailed.join(', ')})</Fragment>
      }

      let color = 'black';
      if (item.primary_balance < 0) {
        color = 'red'
      }

      return (
          <GridListTile key={this.entryId++}>
            <Grid fluid>
              <Row style={{'fontSize': '0.9em'}}>
                <Col xs={2} sm={2} md={2} lg={2}>
                  <div style={{'textTransform': 'capitalize'}}>{item.asset_type}:</div>
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
        const props = this.props;

        const sorted = props.totals.sort((l, r) => {
          const typesInOrder = ['cash', 'current', 'savings', 'deposit', 'credit', 'debt', 'broker', 'tradable'];
          return typesInOrder.indexOf(l.asset_type) - typesInOrder.indexOf(r.asset_type)
        });

        const result = sorted.map((item) => this.renderAsset(props, item));

        return (
            <Fragment>
                <CardHeader title='Financial status' style={this.cardHeaderStyle}/>
                  <CardContent className={this.props.classes.content}>
                    <GridList cellHeight={36} cols={1} className={this.props.classes.panel}>
                        {result}
                    </GridList>
                  </CardContent>
            </Fragment>
        )
    }
}

export default withStyles(styles)(FinanceOverviewPanel)
