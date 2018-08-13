import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ClipLoader from 'react-spinners/ClipLoader';

export default class TransactionDeleteConfirmation extends Component {
    render() {
        var props = this.props;
        var actions;
        if (props.loading) {
            actions = <ClipLoader sizeUnit={'px'} size={150} loading={true}/>;
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
