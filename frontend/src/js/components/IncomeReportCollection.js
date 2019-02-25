import React, {Component, Fragment} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import IncomeReportEventsAccount from './IncomeReportEventsAccount'

export default class IncomeReportCollection extends Component {
    render() {
      var props = this.props
        return (
          <Fragment>
            <ExpansionPanel defaultExpanded={true}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Income operations by account
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <IncomeReportEventsAccount actions={props.actions} data={props.incomeByAccount}/>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Income accounts weight
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {/*<AssetReportCurrency actions={props.actions} data={props.currencyAssetReport}/>*/}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Fragment>
        );
    }
}
