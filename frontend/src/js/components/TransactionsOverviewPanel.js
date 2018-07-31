import React, {Component} from 'react';
import {CardHeader, CardText} from 'material-ui/Card';
import {GridList, GridTile} from 'material-ui/GridList';

import Transaction from './Transaction';

export default class TransactionsOverviewPanel extends Component {
    render() {

        var textStyle = {
            'overflow-x': 'hidden',
            'overflow-y': 'auto',
        };

        var panelStyle = {
            height: 300
        };

        var props = this.props;

        var transactions = props.transactions.map((item) => {
            return <GridTile key={item.id}><Transaction transaction={item} accounts={props.accounts}
                                                        editAction={props.actions.editTransaction}
                                                        deleteAction={props.actions.deleteTransactionRequest}/></GridTile>
        });

        return (
            <div>
                <CardHeader title='Last transactions'/>
                <CardText style={textStyle}>
                    <GridList cellHeight={70} cols={1} style={panelStyle}>
                        {transactions}
                    </GridList>
                </CardText>
            </div>
        )
    }
}
