import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import ClipLoader from 'react-spinners/ClipLoader';

export default class TransactionDeleteConfirmation extends Component {
    render() {
        var props = this.props;
        var actions;
        if (props.loading) {
            actions = <ClipLoader sizeUnit={'px'} size={150} loading={true}/>;
        } else {
            actions = [
                <Button key='cancel-button' color='primary' onClick={props.actions.deleteTransactionCancel}>Cancel</Button>,
                <Button key='delete-button' color='secondary' onClick={() => props.actions.deleteTransaction(props.transaction)}>Delete</Button>,
            ];
        }

        return (
                <Dialog
                    modal={false}
                    open={props.visible}
                    onExit={props.actions.deleteTransactionCancel}
                >
                  <DialogContent>
                    Please confirm transaction '{props.transaction.get('comment')}' deletion
                  </DialogContent>
                  <DialogActions>{actions}</DialogActions>
                </Dialog>
        );
    }
}
