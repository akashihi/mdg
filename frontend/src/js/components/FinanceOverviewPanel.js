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

    render() {
        var props = this.props;

        var totals = props.assetAccounts.reduce((memo, obj) => {
            if (!(obj.attributes.currency_id in memo)) {
                memo[obj.attributes.currency_id] = 0
            }
            memo[obj.attributes.currency_id] += obj.attributes.balance;
            return memo
        }, {});

        var result = Object.keys(totals).map((currency_id) => {
            var value = totals[currency_id].toFixed(2);
            var name = props.currencies.filter((item) => item.id == currency_id).map((item) => item.attributes.name);
            return (
              <GridListTile  key={currency_id}>
                <Grid fluid>
                  <Row>
                      <Col xs={2} sm={2} md={2} lg={2}>
                          <p>{name}:</p>
                      </Col>
                      <Col xs={2} sm={2} md={2} lg={2}>
                          <p style={{'textAlign': 'right'}}>{value}</p>
                      </Col>
                  </Row>
                </Grid>
              </GridListTile>
            )
        });

        return (
            <Fragment>
                <CardHeader title='Financial status'/>
                  <CardContent className={this.props.classes.content}>
                    <GridList cellHeight={70} cols={1} className={this.props.classes.panel}>
                        {result}
                    </GridList>
                  </CardContent>
            </Fragment>
        )
    }
}

export default withStyles(styles)(FinanceOverviewPanel)
