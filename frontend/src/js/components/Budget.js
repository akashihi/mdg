import React, {Component, Fragment} from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
import Done from '@material-ui/icons/Done';

const styles = {
  budgetButton: {
    float: 'right'
  }
};

class BudgetDeleteButtonStyle extends Component {
  render() {
    return (<IconButton className={this.props.classes.budgetButton} onClick={this.props.deleteFunc}><DeleteForever/></IconButton>)
  }
}

var BudgetDeleteButton = withStyles(styles)(BudgetDeleteButtonStyle)

class BudgetSelectButtonStyle extends Component {
  render() {
    return (<IconButton className={this.props.classes.budgetButton} onClick={this.props.selectFunc}><Done/></IconButton>)
  }
}

var BudgetSelectButton = withStyles(styles)(BudgetSelectButtonStyle)

export default class Budget extends Component {
    selectBudget() {
        this.props.selectFunc(this.props.budget)
    }
    deleteBudget() {
        this.props.deleteFunc(this.props.budget.id)
    }
    render() {
        var attr = this.props.budget.attributes;
        var title = attr.term_beginning + ' - ' + attr.term_end;
        var income_expected = attr.outgoing_amount.expected - attr.incoming_amount;
        var income_actual = attr.outgoing_amount.actual - attr.incoming_amount;
        return (
          <Fragment>
            <div>
              {title}
              <BudgetDeleteButton deleteFunc={::this.deleteBudget}/>
            </div>
            <div>
              <p>Actual income: {income_actual}</p>
              <BudgetSelectButton selectFunc={::this.selectBudget}/>
              <p>Expected income: {income_expected}</p>
            </div>
            <Divider/>
          </Fragment>
        )
    }
}
