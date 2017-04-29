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

    onAcceptPeriodBegin(e, dt) {
        this.props.actions.budgetSetNewBegin(dt)
    }

    onAcceptPeriodEnd(e, dt) {
        this.props.actions.budgetSetNewEnd(dt)
    }

    onCreateBudgetClick() {
        this.props.actions.budgetCreate()
    }

    render() {
        var props = this.props;
        var onDeleteBudgetClick = function (id) {
            props.actions.deleteBudget(id)
        };

        var budgets;
        if (props.waiting) {
            budgets = <CircularProgress/>
        } else if (props.error) {
            budgets = <h1>Unable to load budget list</h1>
        } else {
            budgets = props.budgets.map(function (item) {
                return (
                    <Budget budget={item} key={item.id} deleteFunc={onDeleteBudgetClick}/>
                )
            });
        }

        return (
            <Drawer open={props.visible} width='25%'>
                <IconButton style={{float: 'right'}} onClick={::this.onCloseBudgetListClick}><FontIcon
                    className='material-icons'>backspace</FontIcon></IconButton>
                <DatePicker hintText='Budget beginning' container='inline' onChange={::this.onAcceptPeriodBegin}/>
                <DatePicker hintText='Budget end' container='inline' onChange={::this.onAcceptPeriodEnd}/>
                <IconButton disabled={!props.valid} onClick={::this.onCreateBudgetClick}><FontIcon
                    className='material-icons'>add_circle_outline</FontIcon></IconButton>
                {props.formError}
                <Divider/>
                {budgets}
            </Drawer>
        )
    }
}
