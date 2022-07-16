import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { EnrichedTransaction } from '../../models/Transaction';

interface TransactionDeleteProps {
    tx: EnrichedTransaction;
    visible: boolean;
    close: () => void;
    delete: (tx: EnrichedTransaction) => void;
}

export function TransactionDeleteConfirmation(props: TransactionDeleteProps) {
    let name = '';
    if (props.tx) {
        name = props.tx.comment;
        if (!name) {
            name = props.tx.accountNames;
        }
    }
    return (
        <Dialog open={props.visible}>
            <DialogContent>Please confirm transaction '{name}' deletion</DialogContent>
            <DialogActions>
                <Button key="cancel-button" color="primary" onClick={props.close}>
                    Cancel
                </Button>
                <Button key="delete-button" color="secondary" onClick={() => props.delete(props.tx)}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TransactionDeleteConfirmation;
