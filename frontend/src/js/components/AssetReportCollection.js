import React, {Component, Fragment} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AssetReportSimple from './AssetReportSimple'

export default class AssetReportCollection extends Component {
    render() {
        return (
          <Fragment>
            <ExpansionPanel expanded={true}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Assets by time
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <AssetReportSimple/>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Detailed assets by time
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                Data
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                Asset structure
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                Data
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Fragment>
        );
    }
}
