import { connect } from 'react-redux';

import BudgetOverviewPanel from '../components/budget/BudgetOverviewPanel'
import {getCurrentBudget} from '../actions/BudgetActions';
import {Budget} from "../models/Budget";

export interface BudgetOverviewState {
    budget?: Budget
}

const mapStateToProps = (state) => {
  return {
    budget: state.budget.currentBudget
  }
}

const mapDispatchToProps = {getCurrentBudget}

export type BudgetOverviewProps = BudgetOverviewState & typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BudgetOverviewPanel)
