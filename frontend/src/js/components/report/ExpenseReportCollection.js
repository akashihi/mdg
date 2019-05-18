import React, {Component, Fragment} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ExpenseReportEventsAccount from './ExpenseReportEventsAccount'
import ExpenseByAccountWeight from './ExpenseByAccountWeight'

export default class ExpenseReportCollection extends Component {
    render() {
      var props = this.props
        return (
          <Fragment>
            <ExpansionPanel defaultExpanded={true}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Expense operations by account
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <ExpenseReportEventsAccount actions={props.actions} data={props.expenseByAccount}/>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Expense accounts weight
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <ExpenseByAccountWeight actions={props.actions} data={props.expenseByAccountWeight}/>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Fragment>
        );
    }
}
