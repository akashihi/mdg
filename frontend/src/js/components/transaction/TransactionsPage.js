import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ClipLoader from 'react-spinners/ClipLoader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Transaction from './TransactionFullWidget';
import TransactionPager from '../../containers/TransactionsPager'
import TransactionFilter from '../../containers/TransactionsFilter'
import TransactionDeleteDialog from '../../containers/TransactionDeleteDialog'

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

class TransactionsPage extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
      this.setState(state => ({ expanded: !state.expanded }));
    };

    render() {
        const { classes } = this.props;
        const props = this.props;

        const title = 'Showing transactions from ' + props.periodBeginning + ' till ' + props.periodEnd;

        const transactions = props.transactions.map(function (item, id) {
            return (
                <GridListTile key={id}><Transaction id={id} transaction={item} editAction={props.actions.editTransaction} deleteAction={props.actions.deleteTransactionRequest}/></GridListTile>
            )
        }).valueSeq();

        return <div>
            <TransactionDeleteDialog/>
            <Card>
                <CardContent>
                  {title}
                  <IconButton className={classnames(classes.expand, {[classes.expandOpen]: this.state.expanded,})} onClick={this.handleExpandClick} aria-expanded={this.state.expanded} aria-label='Show operations'>
                    <ExpandMoreIcon />
                  </IconButton>
                  </CardContent>
                  <CardContent>
                  <Collapse in={this.state.expanded} timeout='auto' unmountOnExit>
                    <TransactionFilter/>
                  </Collapse>
                </CardContent>
            </Card>
            <Divider/>
            <GridList cols={1} cellHeight='auto'>
                <GridListTile>
                    <Card>
                        <CardHeader>
                            <Grid>
                                <Row>
                                    <Col xs={1}/>
                                    <Col xs={1}>Date</Col>
                                    <Col xs={3}>Comment</Col>
                                    <Col xs={2}>Amount</Col>
                                    <Col xs={2}>Accounts</Col>
                                    <Col xs={2}>Tags</Col>
                                    <Col xs={1}/>
                                </Row>
                            </Grid>
                        </CardHeader>
                    </Card>
                </GridListTile>
                {props.waiting && <ClipLoader sizeUnit={'px'} size={150} loading={true}/>}
                {props.error && <h1>Unable to load transactions list</h1>}
                {transactions}
            </GridList>
            <TransactionPager/>
        </div>;
    }
}

export default withStyles(styles)(TransactionsPage);
