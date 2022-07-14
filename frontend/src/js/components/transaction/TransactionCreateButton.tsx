import React from 'react';
import AddCirce from '@mui/icons-material/AddCircleOutline';
import Fab from '@mui/material/Fab';
import {TransactionCreateButtonProps} from '../../containers/TransactionCreate';

export function TransactionCreateButton(props:TransactionCreateButtonProps) {
      return <Fab color='secondary' aria-label='Add transaction' sx={{
          marginRight: "40px",
          marginBottom: "40px",
          position: 'fixed',
          right: 0,
          bottom: 0
      }} onClick={props.createTransaction}><AddCirce/></Fab>
}

export default TransactionCreateButton;
