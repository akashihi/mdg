import React, {Component, Fragment} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AssetReportSimple from './AssetReportSimple'
import AssetReportCurrency from './AssetReportCurrency'
import AssetReportType from './AssetReportType'

export default class AssetReportCollection extends Component {
    render() {
        const props = this.props;
        return (
            <Fragment>
                <ExpansionPanel defaultExpanded={true}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        Assets by time
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <AssetReportSimple actions={props.actions} data={props.simpleAssetReport} currency={props.currencyName}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        Detailed assets by time
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <AssetReportCurrency actions={props.actions} data={props.currencyAssetReport} currency={props.currencyName}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                        Asset structure
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <AssetReportType actions={props.actions} data={props.assetReportType} currency={props.currencyName}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Fragment>
        );
    }
}
