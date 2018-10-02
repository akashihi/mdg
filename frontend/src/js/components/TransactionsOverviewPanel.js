import React, {Component, Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Transaction from './Transaction';

const styles = {
  content: {
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  panel: {
    height: 300
  }
};

class TransactionsOverviewPanel extends Component {
    render() {
        var props = this.props;

        var transactions = props.transactions.map((item) => {
            return <GridListTile key={item.id}><Transaction transaction={item} accounts={props.accounts} preview={true}
                                                        editAction={props.actions.editTransaction}
                                                        deleteAction={props.actions.deleteTransactionRequest}/></GridListTile>
        });

        return (
            <Fragment>
                <CardHeader title='Last transactions'/>
                <CardContent className={this.props.classes.content}>
                    <GridList cellHeight={70} cols={1} className={this.props.classes.panel}>
                        {transactions}
                    </GridList>
                </CardContent>
            </Fragment>
        )
    }
}

export default withStyles(styles)(TransactionsOverviewPanel)
