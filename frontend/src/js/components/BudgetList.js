import React, {Component} from 'react';
/*import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import DatePicker from 'material-ui/DatePicker';
import ClipLoader from 'react-spinners/ClipLoader';*/

//import Budget from './Budget'

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
        //var props = this.props;
        /*var onSelectBudgetClick = function (budget) {
            props.actions.selectBudget(budget)
        };
        var onDeleteBudgetClick = function (id) {
            props.actions.deleteBudget(id)
        };*/

        /*var budgets;
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
        }*/
        return <div/>
        /*return (
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
        )*/
    }
}
