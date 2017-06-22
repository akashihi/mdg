import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

export default class TransactionDeleteConfirmation extends Component {
    render() {
        var props = this.props;
        var actions;
        if (props.loading) {
            actions = <CircularProgress/>
        } else {
            actions = [
                <FlatButton
                    label='Cancel'
                    primary={true}
                    onClick={props.actions.deleteTransactionCancel}
                />,
                <FlatButton
                    label='Delete'
                    secondary={true}
                    onClick={() => props.actions.deleteTransaction(props.transaction)}
                />,
            ];
        }

        return (
                <Dialog
                    actions={actions}
                    modal={false}
                    open={props.visible}
                    onRequestClose={props.actions.deleteTransactionCancel}
                >
                    Please confirm transaction '{props.transaction.attributes.comment}' deletion
                </Dialog>
        );
    }
}
