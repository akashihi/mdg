import React, {Component} from 'react';
import AddCirce from '@mui/icons-material/AddCircleOutline';
import Fab from '@mui/material/Fab';

export default class TransactionCreateButton extends Component {
    onCreate() {
        this.props.actions.createTransaction();
    }

    render() {
      return (<Fab color='secondary' aria-label='Add transaction' sx={{
          marginRight: 40,
          marginBottom: 40,
          position: 'fixed',
          right: 0,
          bottom: 0
      }} onClick={::this.onCreate}><AddCirce/></Fab>)
    }
}
