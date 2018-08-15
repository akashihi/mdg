import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Backspace from '@material-ui/icons/Backspace';
import Divider from '@material-ui/core/Divider';
import ClipLoader from 'react-spinners/ClipLoader';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import DatePicker from 'react-date-picker'

import Budget from './Budget'

const styles = {
  closeButton: {
    float: 'right'
  }
};

class BudgetCloseButtonStyle extends Component {
  render() {
    return (<IconButton className={this.props.classes.closeButton} onClick={this.props.closeFunc}><Backspace/></IconButton>)
  }
}

var BudgetCloseButton = withStyles(styles)(BudgetCloseButtonStyle)

export default class BudgetList extends Component {
    onCloseBudgetListClick() {
        this.props.actions.toggleBudgetSelector(false)
    }

    onAcceptPeriodBegin(dt) {
        this.props.actions.budgetSetNewBegin(dt)
    }

    onAcceptPeriodEnd(dt) {
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
        console.log(this.props)
        return (
            <Drawer open={props.visible}>
              <div>
                <BudgetCloseButton closeFunc={::this.onCloseBudgetListClick}/>
                <DatePicker onChange={::this.onAcceptPeriodBegin} value={props.begin}/>
                <DatePicker onChange={::this.onAcceptPeriodEnd} value={props.end}/>
                <IconButton disabled={!props.valid} onClick={::this.onCreateBudgetClick}><AddCircleOutline/></IconButton>
              </div>
              {props.formError}
              <Divider/>
              {budgets}
            </Drawer>
        )
    }
}
