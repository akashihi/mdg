import React, { Component, Fragment } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import ExpenseReportEventsAccount from './ExpenseReportEventsAccount'
import ExpenseByAccountWeight from './ExpenseByAccountWeight'

export default class ExpenseReportCollection extends Component {
  render () {
    const props = this.props
    return (
      <>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Expense operations by account
          </AccordionSummary>
          <AccordionDetails>
            <ExpenseReportEventsAccount actions={props.actions} data={props.expenseByAccount} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Expense accounts weight
          </AccordionSummary>
          <AccordionDetails>
            <ExpenseByAccountWeight actions={props.actions} data={props.expenseByAccountWeight} />
          </AccordionDetails>
        </Accordion>
      </>
    )
  }
}
