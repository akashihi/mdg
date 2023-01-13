import React, { useEffect } from 'react';
import { BudgetOverviewProps } from '../../containers/BudgetOverview';
import BudgetInfo from './BudgetInfo';

export function BudgetOverviewPanel(props: BudgetOverviewProps) {
    useEffect(() => {
        props.loadCurrentBudget();
    }, []);

    if (props.budget) {
        return <BudgetInfo short budget={props.budget} />;
    } else {
        return <p>Budget data not available</p>;
    }
}

export default BudgetOverviewPanel;
