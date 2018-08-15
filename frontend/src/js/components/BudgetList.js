import React, {Component} from 'react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Backspace from '@material-ui/icons/Backspace';
import Divider from '@material-ui/core/Divider';
import ClipLoader from 'react-spinners/ClipLoader';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
/*import DatePicker from 'material-ui/DatePicker';*/

import Budget from './Budget'

export default class BudgetList extends Component {
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
        var onSelectBudgetClick = function (budget) {
            props.actions.selectBudget(budget)
        };
        var onDeleteBudgetClick = function (id) {
            props.actions.deleteBudget(id)
        };

        var budgets;
        if (props.waiting) {
            budgets = <ClipLoader sizeUnit={'px'} size={150} loading={true}/>
        } else if (props.error) {
            budgets = <h1>Unable to load budget list</h1>
        } else {
            budgets = props.budgets.map(function (item) {
                return (
                    <Budget budget={item} key={item.id} deleteFunc={onDeleteBudgetClick} selectFunc={onSelectBudgetClick}/>
                )
            });
        }

        return (
            <Drawer open={props.visible}>
              <IconButton onClick={::this.onCloseBudgetListClick}><Backspace/></IconButton>
                {/*<IconButton style={{float: 'right'}}></IconButton>
                <DatePicker hintText='Budget beginning' container='inline' onChange={::this.onAcceptPeriodBegin}/>
                <DatePicker hintText='Budget end' container='inline' onChange={::this.onAcceptPeriodEnd}/>*/}
                <IconButton disabled={!props.valid} onClick={::this.onCreateBudgetClick}><AddCircleOutline/></IconButton>
                {props.formError}
                <Divider/>
                {budgets}
            </Drawer>
        )
    }
}
