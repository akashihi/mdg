import React, { Component, Fragment } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import IncomeReportEventsAccount from './IncomeReportEventsAccount'
import IncomeByAccountWeight from './IncomeByAccountWeight'

export default class IncomeReportCollection extends Component {
  render () {
    const props = this.props
    return (
      <>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Income operations by account
          </AccordionSummary>
          <AccordionDetails>
            <IncomeReportEventsAccount actions={props.actions} data={props.incomeByAccount} />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Income accounts weight
          </AccordionSummary>
          <AccordionDetails>
            <IncomeByAccountWeight actions={props.actions} data={props.incomeByAccountWeight} />
          </AccordionDetails>
        </Accordion>
      </>
    )
  }
}
