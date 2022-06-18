import React, { Component, Fragment } from 'react'
import ExpansionPanel from '@mui/material/ExpansionPanel'
import ExpansionPanelSummary from '@mui/material/ExpansionPanelSummary'
import ExpansionPanelDetails from '@mui/material/ExpansionPanelDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import IncomeReportEventsAccount from './IncomeReportEventsAccount'
import IncomeByAccountWeight from './IncomeByAccountWeight'

export default class IncomeReportCollection extends Component {
  render () {
    const props = this.props
    return (
      <>
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            Income operations by account
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <IncomeReportEventsAccount actions={props.actions} data={props.incomeByAccount} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            Income accounts weight
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <IncomeByAccountWeight actions={props.actions} data={props.incomeByAccountWeight} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </>
    )
  }
}
