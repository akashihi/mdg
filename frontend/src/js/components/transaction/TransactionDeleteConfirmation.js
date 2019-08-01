import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

export default class TransactionDeleteConfirmation extends Component {
    render() {
        const props = this.props;

        return (
            <Dialog open={props.visible} onExit={props.actions.deleteTransactionCancel}>
                <DialogContent>
                    Please confirm transaction {props.name} deletion
                </DialogContent>
                <DialogActions>
                    <Button key='cancel-button' color='primary'
                            onClick={props.actions.deleteTransactionCancel}>Cancel</Button>,
                    <Button key='delete-button' color='secondary'
                            onClick={() => props.actions.deleteTransaction(props.id)}>Delete</Button>
                </DialogActions>
            </Dialog>
        );
    }
}
