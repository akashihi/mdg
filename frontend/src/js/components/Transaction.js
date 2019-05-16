import React, {Component, Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import {timestampToFormattedDate} from '../util/DateUtil'
import Operation from './Operation'

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

class Transaction extends Component {
    state = { expanded: false };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
      };

    renderTransactionAccountList(operations, accounts) {
        //Tx account list should include only non-asset
        //account.
        //If transaction is built only of asset accounts,
        //they should be used
        var opAccounts = operations.map((item) => item.account_id);
        var usedAccounts = accounts.filter((item, key) => opAccounts.includes(key));

        var nonAssetAccounts = usedAccounts.filter((item) => item.get('account_type') !== 'asset');
        if (!nonAssetAccounts.isEmpty()) {
            return nonAssetAccounts.map((item) => item.get('name')).valueSeq().join(', ')
        } else {
            return usedAccounts.map((item) => item.get('name')).valueSeq().join(', ')
        }
    }

    renderOperations(tx, accounts) {
        return tx.get('operations').map(function (item) {
            return (
                <Fragment key={tx.id + '-' + item.account_id}><Operation operation={item} accounts={accounts}/></Fragment>
            )
        });
    }

    getTotalChange(tx, accounts) {
        //We need to calculate totals for all
        //types of accounts.
        //
        //If sum of 'asset' is positive in the tx and
        //at least on of other sums is not negative, it
        //is a 'earn' transaction.
        //
        //if sum of 'asset' is negative it's a 'spending'
        //transaction.
        //
        //if sum of 'asset' is zero and sum of 'expense' is
        //positive, it is still spending.
        //
        //In other cases it's a 'transfer' transaction.

        var summary = tx.get('operations').map((op) => {
            var opAccount = accounts.get(op.account_id);
            return {amount: op.amount, rate: op.rate, type: opAccount.get('account_type')}
        }).reduce((acc, item) => {
          var amount = item.amount;
          if (item.rate) {
            amount = amount * item.rate
          }
          acc[item.type] += amount;
          return acc
        }, {asset: 0, income: 0, expense: 0});

        if (summary['asset'] > 0 && (summary['income'] !== 0 || summary['expense'] !== 0)) {
            return {color: 'lime', total: summary['asset'].toFixed(2)};
        }

        if (summary['asset'] < 0) {
            return {color: 'red', total: summary['asset'].toFixed(2)};
        }

        if (summary['asset'] === 0 && summary['expense'] > 0) {
            return {color: 'red', total: summary['expense'].toFixed(2)};
        }

        var positives = tx.get('operations').map((op) => {
            var opAccount = accounts.get(op.account_id);
            return {amount: op.amount, rate: op.rate, type: opAccount.get('account_type')}
        }).filter((item) => item.amount > 0)
            .reduce((acc, item) => {
              var amount = item.amount;
              if (item.rate) {
                amount = amount * item.rate
              }
              acc[item.type] += amount; return acc
            }, {asset: 0, income: 0, expense: 0});

        if (positives['asset'] !== 0) {
            return {color: 'orange', total: positives['asset'].toFixed(2)};
        }

        if (positives['income'] !== 0) {
            return {color: 'orange', total: positives['income'].toFixed(2)};
        }

        if (positives['income'] !== 0) {
            return {color: 'orange', total: positives['income'].toFixed(2)};
        }

        return {color: 'black', total: 0}
    }

    render() {
        const { classes } = this.props;
        const props = this.props;
        const transaction = props.transaction;

        const operations = ::this.renderOperations(props.transaction, props.accounts);
        const totals = ::this.getTotalChange(props.transaction, props.accounts);

        return <Card>
            <CardContent>
                <Grid>
                    <Row>
                        {!props.preview && <Col xs={1} className='hide-on-small'><Checkbox color='default'/></Col>}
                        <Col xs={3} sm={2} md={1} lg={1}>{timestampToFormattedDate(transaction.get('timestamp'))}</Col>
                        <Col xs={6} sm={3} md={3} lg={3}>{transaction.get('comment')}</Col>
                        <Col xs={3} sm={1} md={1} lg={1}>
                            <div style={{color: totals.color}}>{totals.total}</div>
                        </Col>
                        <Col xs={7} sm={3} md={2} lg={2}>{::this.renderTransactionAccountList(transaction.get('operations'), props.accounts)}</Col>
                        <Col xs={1} sm={3} md={2} lg={2} className='hide-on-small'>{transaction.get('tags').join(', ')}</Col>
                        {!props.preview && <Col xs={5} sm={3} md={2} lg={2}>
                          <Button aria-label='Edit' onClick={() => props.editAction(props.id, props.transaction)}><Edit/></Button>
                          <Button aria-label='Delete' onClick={() => props.deleteAction(props.id, props.transaction)}><Delete/></Button>
                          <IconButton className={classnames(classes.expand, {[classes.expandOpen]: this.state.expanded,})} onClick={this.handleExpandClick} aria-expanded={this.state.expanded} aria-label='Show operations'>
                            <ExpandMoreIcon />
                          </IconButton>
                        </Col>}
                    </Row>
                </Grid>
            </CardContent>
            <CardContent>
              <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
                <Grid>
                    {operations}
                </Grid>
              </Collapse>
            </CardContent>
        </Card>;
    }
}

export default withStyles(styles)(Transaction);
