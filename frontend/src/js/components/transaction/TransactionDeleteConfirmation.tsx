import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { EnrichedTransaction } from '../../models/Transaction';

interface TransactionDeleteProps {
    tx?: EnrichedTransaction;
    visible: boolean;
    close: () => void;
    delete: (tx: EnrichedTransaction) => void;
}

export function TransactionDeleteConfirmation(props: TransactionDeleteProps) {
    if (props.tx) {
        const name = props.tx.comment ? props.tx.comment : props.tx.accountNames;
        return (
            <Dialog open={props.visible}>
                <DialogContent>Please confirm transaction '{name}' deletion</DialogContent>
                <DialogActions>
                    <Button key="cancel-button" color="primary" onClick={props.close}>
                        Cancel
                    </Button>
                    <Button key="delete-button" color="secondary" onClick={() => {if(props.tx) {props.delete(props.tx)}}}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        );
    } else {
        return <div/>
    }
}

export default TransactionDeleteConfirmation;
