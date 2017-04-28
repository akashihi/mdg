import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import DatePicker from 'material-ui/DatePicker';
import CircularProgress from 'material-ui/CircularProgress';

import Budget from './Budget'

export default class BudgetList extends Component {
    componentDidMount() {
        this.props.actions.loadBudgetList()
    }
    onCloseBudgetListClick() {
        this.props.actions.toggleBudgetSelector(false)
    }

    render() {
        var budgets = this.props.budgets.map(function (item) {
            return (
                <Budget budget={item} key={item.id}/>
            )
        });
        if (this.props.loading) {
            budgets = <CircularProgress/>
        }

        return (
            <Drawer open={this.props.visible}>
                <IconButton style={{float: 'right'}} onClick={this.onCloseBudgetListClick.bind(this)}><FontIcon
                    className='material-icons'>backspace</FontIcon></IconButton>
                <DatePicker hintText='Budget beginning' container='inline'/>
                <DatePicker hintText='Budget end' container='inline'/>
                <IconButton><FontIcon className='material-icons'>add_circle_outline</FontIcon></IconButton>
                <Divider/>
                {budgets}
            </Drawer>
        )
    }
}
