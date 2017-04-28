import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import DatePicker from 'material-ui/DatePicker';

import Budget from './Budget'

export default class BudgetPage extends Component {
    onCloseBudgetListClick() {
        this.props.actions.toggleBudgetSelector(false)
    }
    render() {
        return (
                <Drawer open={this.props.visible}>
                    <IconButton style={{float:'right'}} onClick={this.onCloseBudgetListClick.bind(this)}><FontIcon className='material-icons'>backspace</FontIcon></IconButton>
                    <DatePicker hintText='Budget beginning' container='inline' />
                    <DatePicker hintText='Budget end' container='inline' />
                    <IconButton><FontIcon className='material-icons'>add_circle_outline</FontIcon></IconButton>
                    <Divider/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                    <Budget/>
                </Drawer>
        )
    }
}
