import React, { Component, Fragment } from 'react'
import ExpansionPanel from '@mui/material/ExpansionPanel'
import ExpansionPanelSummary from '@mui/material/ExpansionPanelSummary'
import ExpansionPanelDetails from '@mui/material/ExpansionPanelDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import ExpenseReportEventsAccount from './ExpenseReportEventsAccount'
import ExpenseByAccountWeight from './ExpenseByAccountWeight'

export default class ExpenseReportCollection extends Component {
  render () {
    const props = this.props
    return (
      <>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            Expense operations by account
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ExpenseReportEventsAccount actions={props.actions} data={props.expenseByAccount} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            Expense accounts weight
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ExpenseByAccountWeight actions={props.actions} data={props.expenseByAccountWeight} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </>
    )
  }
}
