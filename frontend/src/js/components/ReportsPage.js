import React, {Component, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AssetReportCollection from './AssetReportCollection'

export default class ReportsPage extends Component {
    state = { tabValue: 'asset' };

    switchTab(ev, value) {
        this.setState({
            tabValue: value,
        });
    }

    render() {
        return (
          <Fragment>
            <Tabs value={this.state.tabValue} onChange={::this.switchTab} centered>
                <Tab label='Asset report' value='asset'/>
                <Tab label='Budget report' value='budget'/>
                <Tab label='Incomes report' value='income'/>
                <Tab label='Expenses report' value='expenses'/>
            </Tabs>
            {this.state.tabValue == 'asset' && <AssetReportCollection/>}
            {this.state.tabValue == 'budget' && <div>Budget report</div>}
            {this.state.tabValue == 'income' && <div>Incomes report</div>}
            {this.state.tabValue == 'expenses' && <div>Expenses report</div>}
          </Fragment>
        );
    }
}
