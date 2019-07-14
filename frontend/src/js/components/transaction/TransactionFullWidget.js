import React, {Fragment} from 'react';
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

import TransactionBase from './TransactionBase'

import {timestampToFormattedDate} from '../../util/DateUtil'
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

class TransactionFullWidget extends TransactionBase {
    state = { expanded: false };

    handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
      };

    renderOperations(tx, accounts) {
        return tx.get('operations').map(function (item) {
            return (
                <Fragment key={tx.id + '-' + item.account_id}><Operation operation={item} accounts={accounts}/></Fragment>
            )
        });
    }

    render() {
        const { classes } = this.props;
        const props = this.props;
        const transaction = props.transaction;

        const operations = ::this.renderOperations(props.transaction, props.accounts);
        const totals = ::this.getTotalChange();

        return <Card>
            <CardContent>
                <Grid>
                    <Row>
                        <Col xs={1} className='hide-on-small'><Checkbox color='default'/></Col>
                        <Col xs={3} sm={2} md={1} lg={1}>{timestampToFormattedDate(transaction.get('timestamp'))}</Col>
                        <Col xs={6} sm={3} md={3} lg={3}>{transaction.get('comment')}</Col>
                        <Col xs={3} sm={1} md={1} lg={1}>
                            <div style={{color: totals.color}}>{totals.total}</div>
                        </Col>
                        <Col xs={7} sm={3} md={2} lg={2}>{::this.renderTransactionAccountList(transaction.get('operations'), props.accounts)}</Col>
                        <Col xs={1} sm={3} md={2} lg={2} className='hide-on-small'>{transaction.get('tags').join(', ')}</Col>
                        <Col xs={5} sm={3} md={2} lg={2}>
                          <Button aria-label='Edit' onClick={() => props.editAction(props.id, props.transaction)}><Edit/></Button>
                          <Button aria-label='Delete' onClick={() => props.deleteAction(props.id, props.transaction)}><Delete/></Button>
                          <IconButton className={classnames(classes.expand, {[classes.expandOpen]: this.state.expanded,})} onClick={this.handleExpandClick} aria-expanded={this.state.expanded} aria-label='Show operations'>
                            <ExpandMoreIcon />
                          </IconButton>
                        </Col>
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

export default withStyles(styles)(TransactionFullWidget);
