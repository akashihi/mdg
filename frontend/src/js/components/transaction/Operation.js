import React, { Component } from 'react';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

export default class Operation extends Component {
  render () {
    const operation = this.props.operation

    return (
      <div style={{ color: operation.color }}>
          <Grid item xs={6} sm={6} mdOffset={6} md={4} lgOffset={6} lg={4}>{operation.name}:</Grid>
          <Grid item xs={6} sm={6} md={2} lg={2}>{operation.amount}</Grid>
        <Grid item xs={6} xsOffset={6} mdOffset={10} md={2} lgOffset={10} lg={2}><Divider /></Grid>
      </div>
    )
  }
}
