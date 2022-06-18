import React, { Component } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

export default class TransactionDeleteConfirmation extends Component {
  render () {
    const props = this.props

    return (
      <Dialog open={props.visible} onExit={props.actions.deleteTransactionCancel}>
        <DialogContent>
          Please confirm transaction {props.name} deletion
        </DialogContent>
        <DialogActions>
          <Button
            key='cancel-button' color='primary'
            onClick={props.actions.deleteTransactionCancel}
          >Cancel
          </Button>,
          <Button
            key='delete-button' color='secondary'
            onClick={() => props.actions.deleteTransaction(props.id)}
          >Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
